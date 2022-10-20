import React, { useEffect, useState } from 'react';

import TextField from './TextField';
import {
    ExportConfig,
} from '../../../shared/';

type ExportConfigOverviewProps = {
    config?: ExportConfig,
};

export default function ExportConfigOverview(props : ExportConfigOverviewProps) {
    const {config} = props;
    const parts = [
        ['Configuration Label:', config?.label],
        ['FHIR URL:', config?.connectionInformation?.fhirUrl],
        ['Auth URL:', config?.connectionInformation?.authUrl],
        ['Application Client ID:', config?.connectionInformation?.clientId],
        ['Group ID:', config?.exportInformation?.groupId],
    ];

    return <div className='grid-container border-1px border-base-lighter '>
        <div className="grid-row margin-top-2 grid-gap-2">
            <div className="grid-col-auto text-bold ">
                {parts.map(x => <div className='height-4 text-middle' key={x[0]}>{x[0]}</div>)}
            </div>
            <div className="grid-col-auto text-middle">
                {parts.map(x => <div className='height-4' key={x[1]}>{x[1]}</div>)}
            </div>
        </div>
    </div>;
}