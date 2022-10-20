import 'regenerator-runtime/runtime';
import nodeFetch from 'node-fetch';
import {ExportConfigServiceApi} from './';

const BASE_URI = 'http://localhost:8090/provider/api';

const instance = new ExportConfigServiceApi({
    baseUrl: BASE_URI,
    fetch: nodeFetch as typeof fetch
});

test('saving to api', async () => {
    const result = await instance.create({
        connectionInformation: {
            authUrl:'test'
        }
    });
    expect(result)
        .toMatchObject({
            connectionInformation: {
                authUrl: "test"
            }
        })
    expect(result._id).toBeDefined();
});

const fhir_url_config = {"err":"","page":10000,"dur":1,"tlt":15,"m":1,"stu":4,"del":0};
const base_64_fhir_url_config = Buffer.from(JSON.stringify(fhir_url_config)).toString('base64');
const validExportConfig = {
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
    "connectionInformation": {
        "fhirUrl": `http://bulk-data-server:9443/${base_64_fhir_url_config}/fhir`,
        "authUrl": "http://bulk-data-server:9443/auth/token",
        "clientId": "invalid_client_id"
    },
    "exportInformation": {
        "groupId": "test123"
    }
};
describe('api.validate', () => {
    it('should result in success for valid configuration', async () => {
        const result = await instance.validate(validExportConfig);
        expect(result)
            .toMatchObject({
                success: true
            });
    });
});