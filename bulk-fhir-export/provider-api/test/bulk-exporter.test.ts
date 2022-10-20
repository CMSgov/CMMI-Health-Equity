const fs = require('fs');
import mongoose from 'mongoose';
import BulkExporter from '../export-engine/bulk-exporter';
import ExportConfigService, { ExportConfig } from '../export-config-service';

// The test runs our provider-api code on the local machine, which makes a call to the 
// bulk data server, so we need to use `localhost` as the fhirUrl host 
// - but the bulk data server is running on the Docker network, so we need to use
// `content-server:80` embedded in the clientId.


const fhir_url_config = {"err":"","page":10000,"dur":1,"tlt":15,"m":1,"stu":4,"del":0};
const base_64_fhir_url_config = Buffer.from(JSON.stringify(fhir_url_config)).toString('base64');



const validExportConfig = {
    "exports": [],
    "connectionInformation": {
        "fhirUrl": `http://bulk-data-server:9443/${base_64_fhir_url_config}/fhir`,
        "authUrl": "http://bulk-data-server:9443/auth/token",
        "clientId": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InJlZ2lzdHJhdGlvbi10b2tlbiJ9.eyJqd2tzX3VybCI6Imh0dHA6Ly9jb250ZW50LXNlcnZlcjo4MC9qd2tzL3Rlc3QtY29uZmlnLmpzb24iLCJhY2Nlc3NUb2tlbnNFeHBpcmVJbiI6MTUsImlhdCI6MTY0OTM2MTAyMH0.Z_-BSnKWHaj_VYtcseld2wwVnnTIqFZe6XLdVmVdzqw"
    },
    "exportInformation": {
        "groupId": "test123"
    }
};
const invalidExportConfig = {
    "exports": [],
    "connectionInformation": {
        "fhirUrl": `http://bulk-data-server:9443/${base_64_fhir_url_config}/fhir`,
        "authUrl": "http://bulk-data-server:9443/auth/token",
        "clientId": "invalid_client_id"
    },
    "exportInformation": {
        "groupId": "test123"
    }
};

const mongoUri = process.env.MONGO_URI;
const mongoDbName = process.env.MONGO_DB_NAME;

const getConfig = (connectInfo: any) : ExportConfig => {
    const info = {
        ... validExportConfig.connectionInformation,
        ... connectInfo
    };

    return {...validExportConfig, connectionInformation: info} as ExportConfig;
}

describe('BulkExporter', () => {
    const bulkExport = new BulkExporter();

    beforeAll(async () => {
        await mongoose.connect(mongoUri, {
            dbName: mongoDbName 
        });
    });

    afterAll(() => {
        mongoose.disconnect();
    });


    describe('doBulkExport', () => {
        it('kicks off export and downloads the export file', async () => {
            const config = await new ExportConfigService().create(validExportConfig)
            expect(config._id).toBeDefined();
            const bulkExportKickoffResult = await bulkExport.doBulkExport(config)
    
            expect(bulkExportKickoffResult.configId).toBeDefined();
            expect(bulkExportKickoffResult.bulkExportId).toBeDefined();

            const config2 = await new ExportConfigService().get(bulkExportKickoffResult.configId);
            expect(config2.exports[0].statuses.length).toEqual(1);

            await new Promise((r) => setTimeout(r, 4000));

            const config3 = await new ExportConfigService().get(bulkExportKickoffResult.configId);
            const newStatus = config3.exports[0].statuses[config3.exports[0].statuses.length -1];
            const fileName = newStatus.output[0].localFile;

            expect(fileName).toBeDefined();
        }, 10000);
    });

    it('obtains token with valid export config', async () => {
        const res = await bulkExport.getAccessToken(validExportConfig as ExportConfig);
        expect(res["token"]).toBeDefined();
    });

    it('does not obtain token with invalid export config', async () => {
        const res = await bulkExport.getAccessToken(invalidExportConfig as ExportConfig);
        expect(res["token"]).toBeUndefined();
        expect(res["error"]).toBeDefined();
    });

    it('kicks off bulk export', async () => { 
        const res = await bulkExport.startExport(validExportConfig as ExportConfig);
        expect(res["status"]).toEqual(202);
    });

    it('relays an error if passed invalid token', async () => {
        const res = await bulkExport.startExport(validExportConfig as ExportConfig, "invalid_token");
        expect(res["error"]).toBeDefined();
    });

    it('successfully notifies client of file generation', async () => { 
        const res = await bulkExport.startExport(validExportConfig as ExportConfig);
        expect(res["location"]).toBeDefined();
        expect(res["token"]).toBeDefined();
        const statusRes = await bulkExport.checkExportStatus(res["location"], res["token"]);
        expect(statusRes["progress"]).toBeDefined();
        const waitRes = await bulkExport.waitForExportToComplete(res["location"], res["token"]);
        expect(waitRes["output"][0]["url"]).toBeDefined();
    }, 3000);

    it('should fail if there is an client id', async () => {
        const res = (await bulkExport.validateConfig(getConfig({
            clientId: 'invalid-id'
        })));
        expect(res).toEqual({
            success: false,
            error: {
                invalid_client_id: true
            }
        });
    });
    it('should fail if there is an invalid auth uri', async () => {
        const res = (await bulkExport.validateConfig(getConfig({
            authUrl: 'http://bulk-data-server:9443/auth/token2'
        })));
        expect(res).toEqual({
            success: false,
            error: {
                invalid_auth_uri: true
            }
        });
    });
    it('should fail if there is an invalid fhir uri', async () => {
        const res = (await bulkExport.validateConfig(getConfig({
            fhirUrl: 'http://bulk-data-server:9443/${base_64_fhir_url_config}'
        })));
        expect(res).toEqual({
            success: false,
            error: {
                invalid_fhir_uri: true
            }
        });
    });

    it('successfully downloads file', async () => { 
        const res = await bulkExport.startExport(validExportConfig as ExportConfig);
        const waitRes = await bulkExport.waitForExportToComplete(res["location"], res["token"]);
        const outputFile = await bulkExport.getExportFile(waitRes["output"][0]["url"], res["token"]);
        expect(fs.existsSync(outputFile)).toEqual(true);
    }, 3000);

});
