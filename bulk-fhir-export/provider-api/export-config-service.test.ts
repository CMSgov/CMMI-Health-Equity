import { mongoose } from "@typegoose/typegoose";
import ExportConfigService from "./export-config-service";
import {join} from 'path';
const fs = require('fs');


describe('ExportConfigService', () => {
    const service = new ExportConfigService();

    beforeAll(async () => {
        await mongoose.connect('mongodb://root:pass@mongo:27017', {
            dbName: 'test-db'
        });
    });
    afterAll(() => {
        mongoose.disconnect();
    })

    it('create', async () => {
        const config = await service.create({
            connectionInformation: {
                authUrl: '',
                clientId: '',
                fhirUrl: ''
            },
            exportInformation: {
                groupId: ''
            }
        });
        expect(config).toHaveProperty('_id');
    });

    it('update', async () => {
        const config = await service.create({
            connectionInformation: {
                authUrl: '',
                clientId: '',
                fhirUrl: ''
            },
            exportInformation: {
                groupId: ''
            }
        });

        config.connectionInformation.authUrl='testing';
        const res = await service.update(config);
        expect(res).toHaveProperty('connectionInformation.authUrl', 'testing');
    });

    it('serves file', async() => {
        const config = await service.create({
            connectionInformation: {
                authUrl: '',
                clientId: '',
                fhirUrl: ''
            },
            exportInformation: {
                groupId: ''
            },
            exports: [{
                startTime: new Date(),
                statuses: [{
                    output: [{
                        type: '',
                        count: 100,
                        url: '',
                        localFile: join(__dirname, '/bulk-output-files/testexportfile.ndjson'),
                    }]
                }]
            }]
        });

        const content = await service.getExportFile(config._id, '0');
        expect(content).toBeTruthy();
    })
});
