export interface ConnectionInformation {
    fhirUrl?: string
    authUrl?: string
    clientId?: string
}

export interface ExportInformation {
    groupId?: string
    resource?: string
}

export interface ExportStatusOutput {
    type: string
    count: number
    url: string
    localFile: string
}

export interface ExportStatus {
    status?: number
    progress?: string
    location?: string
    wait?: number
    token?: string
    finished?: boolean
    output?: ExportStatusOutput[]
    error?: {}[]
}

export interface BulkExport  {
    _id?: string
    label?: string
    startTime: Date
    statuses?: ExportStatus[]
}

export interface ExportConfig {
    _id?: string
    label?: string
    connectionInformation?: ConnectionInformation
    exportInformation?: ExportInformation
    exports?: BulkExport[]
}

export interface ConnectionError {
    missing_values?: boolean

    invalid_fhir_uri?: boolean
    invalid_auth_uri?: boolean
    invalid_client_id?: boolean
}

export interface ConnectionTestResult {
    success: boolean
    error?: ConnectionError
}

export interface NewExport {
    exportId: string
    label: string
}
export interface NewExportResult {
    success: boolean
    errors?: [{message:string}]
}
