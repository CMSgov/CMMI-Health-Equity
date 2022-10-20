import Axios from 'axios';
import * as crypto from 'crypto';
import * as querystring from 'querystring';
import * as jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import {createWriteStream} from 'fs';
import {join} from 'path';

import ExportConfigService, { ExportConfig, ExportStatus, BulkExport } from '../export-config-service';
import { ConnectionError, ConnectionTestResult } from '../../shared';
import * as config from '../jwks/test-config.json';

const { keys } = config;
const privateKey = keys.find(x => x.key_ops.includes('sign'));

export type AccessTokenResult={
    token?: string
    error?: ConnectionError
};

export type BulkExportKickoffResult={
    configId: string
    bulkExportId: string
}
/*
* Implements the Bulk Export protocol defined in https://build.fhir.org/ig/HL7/bulk-data/export.html.
*
* When complete, this class will kick off a bulk export with a FHIR server given an export configuration,
* periodically check the status of that export, and download the export to the server filesystem when complete.
*
*/

export default class BulkExporter {
    public async doBulkExport(exportConfig: ExportConfig): Promise<BulkExportKickoffResult> {
        const token = await this.getAccessToken(exportConfig);
        const exportStatus = await this.startExport(exportConfig, token.token);
        if (!exportConfig.exports) {
            exportConfig.exports = [];
        }

        exportConfig.exports.push({
            startTime: new Date(),
            statuses: [exportStatus]
        });

        const config = await new ExportConfigService().update(exportConfig);

        setTimeout(() => 
            this.checkAndSaveExportStatus(config, config.exports.length - 1, token.token), 
        3000);

        return { configId: exportConfig._id, bulkExportId: (config.exports.length - 1).toString() }
    }

    public async checkAndSaveExportStatus(exportConfig: ExportConfig, bulkExportId: number, token: string): Promise<ExportStatus> {
        const bulkExport = exportConfig.exports[bulkExportId];
        const { location }= bulkExport.statuses[bulkExport.statuses.length - 1];
        const exportStatus = await this.checkExportStatus(location, token);
        if (exportStatus.finished) {
            // TODO: Modify to download multiple files, not just one. Many exports will be split into N files.
            const fileName = await this.getExportFile(exportStatus.output[0].url, token);
            exportStatus.output[0].localFile = fileName;
        }
        exportConfig.exports[bulkExportId].statuses.push(exportStatus);
        const config = await new ExportConfigService().update(exportConfig);

        if (exportStatus.finished) {
            return exportStatus;
        }

        // TODO: should the 'wait' value have a default value, and what should it be?
        await new Promise(resolve => setTimeout(resolve, exportStatus.wait));
        return await this.checkAndSaveExportStatus(exportConfig, bulkExportId, token);
    }   

    // Signed token request
    public async getAccessToken(exportConfig: ExportConfig): Promise<AccessTokenResult> {
        const jwtToken = {
            iss: exportConfig.connectionInformation.clientId,
            sub: exportConfig.connectionInformation.clientId,
            aud: exportConfig.connectionInformation.authUrl,
            exp: Date.now() / 1000 + 300, // 5 min
            jti: crypto.randomBytes(32).toString('hex')
        };
        const { kid, alg, kty } = privateKey;
        const pem = jwkToPem(privateKey, { private: true });
        const signed = jwt.sign(
            jwtToken,
            pem,
            {
                algorithm: alg,
                keyid: kid,
                header: {
                    // jku: config.jwks_url || undefined,
                    kty
                }
            }
        );

        const form = querystring.stringify({
            scope: 'system/Patient.read',
            grant_type: 'client_credentials',
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
            client_assertion: signed
        });

        let error;
        const response: any = await Axios.post(exportConfig.connectionInformation.authUrl, form, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).catch((err: any) => {
            console.debug("Error when obtaining token");
            // TODO: sort through types of errors and handle:
            // - invalid FHIR url
            // - invalid JWKS url
            // - invalid information in the token
            error = err;
        });
        
        if (error) {
            const data = error.response?.data;
            // this error_description match only applies to the bulk sandbox from SMART
            // the logic for this would be different from other EHR / FHIR implementations
            if(data?.error_description?.match(/^Invalid client details token.+/)) {
                return {
                    error: {
                        invalid_client_id: true
                    }
                };
            }
            return {
                error: {
                    invalid_auth_uri: true
                }
            };
        }

        return { token: response.data?.access_token };
    }

    // Validate the user-saved export configuration (not a component of the protocol, but used for our UI)
    public async validateConfig(exportConfig?: ExportConfig): Promise<ConnectionTestResult> {
        if(!exportConfig) return {
            success: false,
            error: {
                missing_values: true
            }
        };
        const {
            connectionInformation: {
                authUrl,
                clientId,
                fhirUrl
            }
        } = exportConfig || {};

        if(!authUrl.length || !clientId.length || !fhirUrl.length) return {
            success: false,
            error: {
                missing_values: true
            }
        };

        let capability;
        try {
            const response = (await Axios.get(`${fhirUrl}/metadata`));
            capability = response.data;
        } catch(e) {
            return {
                success: false,
                error: {
                    invalid_fhir_uri: true
                }
            };
        }

        let token;
        try {
            token = await this.getAccessToken(exportConfig);
            if(token.error) return {
                success: false,
                error: token.error
            }
        } catch(e) {
            return {
                success: false,
                error: e
            }
        }

        return {
            success: true
        };
    }
    // Kickoff request
    public async startExport(exportConfig: ExportConfig, token?: string): Promise<ExportStatus> {
        if (!token) {
            const accessToken = await this.getAccessToken(exportConfig);
            token = accessToken.token;
        }

        let error;
        const response: any = await Axios.get(`${exportConfig.connectionInformation.fhirUrl}/Patient/$export?_type=Patient`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/fhir+json',
                Prefer: 'respond-async'
            }
        }).catch((err: any) => {
            console.debug('error: ', err.response.data);
            error = err.response.data;
        });

        if (error) {
            return { error: error };
        }

        const { status, headers } = response;
        const location = headers['content-location'];
        
        return {status: status, location: location, token: token };
    }

    // Status request
    public async checkExportStatus(location: string, token: string): Promise<ExportStatus> {
        const response = await Axios.get(location, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const { status, headers, data } = response;
        const progress = headers['x-progress'];
        const waitStr = headers['retry-after'];
        // Retry-after is in seconds, want it in milliseconds
        const wait = parseInt(waitStr) * 1000;

        let result;
        if (status === 202) {
            result = { status, progress, location, finished: false, wait };
        } else if (status === 200) {
            result = { status, progress, location, finished: true, output: data.output };
        } else {
            result = { status, progress, location, finished: true, error: data.error };
        }

        return result;
    }

    public async waitForExportToComplete(location: string, token: string): Promise<{}> {
        const check = await this.checkExportStatus(location, token);
        if (check.finished) return check;
        const { wait } = check;
        console.log('Waiting:', wait, 'ms');
        await new Promise(resolve => setTimeout(resolve, wait));
        return await this.waitForExportToComplete(location, token);
    }

    // Retrieve files from the export
    public async getExportFile(url: string, token: string): Promise<string> {
        const timestamp = new Date().getTime();
        const response = await Axios.get(url, {
            headers: {
            Authorization: `Bearer ${token}`
            },
            responseType: 'stream'
        });
        const outputFile = join(__dirname, '../bulk-output-files/data.' + (timestamp) + '.ndjson');
        const stream = response.data.pipe(createWriteStream(outputFile));
        await new Promise((resolve, reject) => {
            stream.on('close', resolve);
            stream.on('error', reject);
        });
        return outputFile;
    }
}
