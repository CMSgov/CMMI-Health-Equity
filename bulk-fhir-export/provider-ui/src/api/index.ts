import {
    ExportConfig,
    ConnectionTestResult
} from '../../../shared';

type ExportConfigServiceApiProps = {
    readonly baseUrl: string,
    fetch: typeof fetch
}
export class ExportConfigServiceApi {
    private props : ExportConfigServiceApiProps;

    constructor(props: ExportConfigServiceApiProps) {
        props.fetch ??= fetch;
        this.props = props;
    }

    public async validate(config: ExportConfig) : Promise<ConnectionTestResult> {
        const {baseUrl,fetch} = this.props;
        const response = await fetch(`${baseUrl}/config/validate`, {
            method: 'post',
            body: JSON.stringify(config),
            headers: {
                'content-type': 'application/json'
            }
        });
        const body = await response.json();
        return body as ConnectionTestResult;
    }

    public async getList() : Promise<ExportConfig[]> {
        const {baseUrl,fetch} = this.props;
        const response = await fetch(`${baseUrl}/config`);
        const body = await response.json();
        return body as ExportConfig[];
    }

    public async get(_id: string) : Promise<ExportConfig> {
        const {baseUrl,fetch} = this.props;
        const response = await fetch(`${baseUrl}/config/${_id}`);
        const body = await response.json();
        return body as ExportConfig;
    }

    public async create(config: ExportConfig) : Promise<ExportConfig> {
        const {baseUrl,fetch} = this.props;
        const response = await fetch(`${baseUrl}/config`, {
            method: 'post',
            body: JSON.stringify(config),
            headers: {
                'content-type': 'application/json'
            }
        });
        const body = await response.json();
        return body as ExportConfig;
    }

    public async export(_id: string): Promise<ExportConfig> {
        const { baseUrl, fetch } = this.props;
        const response = await fetch(`${baseUrl}/config/${_id}/export`, {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
        });
        const body = await response.json();
        return body as ExportConfig;
      }

    public async update(config: ExportConfig) : Promise<ExportConfig> {
        const {baseUrl,fetch} = this.props;
        const id = config._id;
        if(!id) throw new Error('config without an id cannot be updated');
        const response = await fetch(`${baseUrl}/config/${id}`, {
            method: 'put',
            body: JSON.stringify(config),
            headers: {
                'content-type': 'application/json'
            }
        });
        const body = await response.json();
        return body as ExportConfig;
    }

    public getFileUrl(configId: string, exportId: number) : string {
        const { baseUrl } = this.props;
        if(!configId) throw new Error('No config id');
        return `${baseUrl}/config/${configId}/export/${exportId}/file`        
    }
}
