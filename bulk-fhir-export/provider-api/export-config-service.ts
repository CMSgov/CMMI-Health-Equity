import { prop, getModelForClass } from '@typegoose/typegoose';
const { promises: fs } = require("fs");

import * as Shared  from '../shared';
import BulkExporter from './export-engine/bulk-exporter';

class ConnectionInformation implements Shared.ConnectionInformation {
    @prop()
    fhirUrl: string

    @prop()
    authUrl: string

    @prop()
    clientId: string
}

class ExportInformation implements Shared.ExportInformation {
    @prop()
    groupId: string
}

class ExportStatusOutput implements Shared.ExportStatusOutput {
    @prop()
    type: string

    @prop()
    count: number

    @prop()
    url: string

    @prop()
    localFile: string
}

export class ExportStatus implements Shared.ExportStatus {
    @prop()
    status?: number

    @prop()
    progress?: string

    @prop()
    location?: string
    
    @prop()
    wait?: number

    @prop()
    token?: string

    @prop()
    finished?: boolean

    @prop()
    error?: any

    @prop()
    output?: ExportStatusOutput[]
}

export class BulkExport implements Shared.BulkExport {
    @prop()
    statuses?: ExportStatus[]

    @prop()
    startTime: Date

    @prop()
    label?: string
}

export class ExportConfig implements Shared.ExportConfig {
    _id?: string

    @prop()
    label?: string

    @prop({required: true})
    connectionInformation: ConnectionInformation

    @prop()
    exportInformation: ExportInformation

    @prop()
    exports?: BulkExport[]
}

export const ExportConfigModel = getModelForClass(ExportConfig);
// const BulkExportModel = getModelForClass(BulkExport);

export default class ExportConfigService {
    public async create(config: ExportConfig) : Promise<ExportConfig> {
        const result = await ExportConfigModel.create(config);
        return result;
    }

    public async update(config: ExportConfig) : Promise<ExportConfig> {
        if (config._id == null) throw new Error('_id is required for update');
        await ExportConfigModel.updateOne({_id: config._id}, config);
        return config;
    }

    public async get(_id: string) : Promise<ExportConfig> {
        return ExportConfigModel.findById(_id);
    }

    public async getAll() : Promise<ExportConfig[]> {
        return ExportConfigModel.find();
    }
    
    public async validate(id: string) : Promise<{}> {
        const exportConfig = await ExportConfigModel.findById(id).exec();
        return new BulkExporter().getAccessToken(exportConfig);
    }

    public async validateConfig(config: ExportConfig) : Promise<Shared.ConnectionTestResult> {
        return new BulkExporter().validateConfig(config);
    }

    public async getExportFile(configId: string, exportId: string) : Promise<string> {
        const config = await this.get(configId);
        const exports = config.exports[parseInt(exportId, 10)];
        if (!exports) throw new Error("exportId not valid");
        const statuses = exports.statuses;
        const fileName = statuses[statuses.length - 1].output[0].localFile;
        const content = await fs.readFile(fileName, "utf8", (error, data) => {
          if (error) throw error;
          return data;
        });
        return fileName;
    }
}
