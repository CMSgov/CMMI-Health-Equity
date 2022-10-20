import React from 'react';

// import 'uswds/css/uswds.css';

import '@trussworks/react-uswds/lib/uswds.css';
import '@trussworks/react-uswds/lib/index.css';

import { ExportConfig } from '../../../shared';
import { IconCheckCircle, Grid, GridContainer, IconCancel, IconRadioButtonUnchecked, IconSchedule, Fieldset, ButtonGroup, Button } from '@trussworks/react-uswds';
import { relative } from 'path';

type ExportStatusProps = {
    config: ExportConfig,
    // identify the ID for the given status so we can pull it from the config
    // this allows starting a new export, etc
    exportId: string,
    cancelExport?: ()=>Promise<any>
};

export function ExportStatus(props: ExportStatusProps) {
    const {config, exportId} = props;

    const {exports=[]} = config;
    const selectedExport = exports.find(x=>x._id==exportId);
    const status = selectedExport?.statuses?.slice(-1)[0] ?? {};

    const parts = [];
    if(status.error) parts.push({
        // icon: <IconCancel color='red' size={4}/>,
        status: 'error',
        text: 'Patient data exported from EHR'
    });
    else parts.push({
        status: 'complete',
        // icon: <IconCheckCircle color='green' size={4}/>,
        text: 'Patient data exported from EHR'
    });

    parts.push({
        text: 'Files downloaded to server'
    });
    parts.push({
        text: 'Data uploaded to CMS'
    });

    parts.forEach((x:any) => {
        if(x.status == 'error') x.icon = <IconCancel color='red' size={4}/>;
        else if(x.status == 'complete') x.icon = <IconCheckCircle color='green' size={4}/>;
        else x.icon = <IconSchedule color='gray' size={4}/>;
    });

    return <div>
        <Fieldset legend={selectedExport?.label} legendStyle="large">{null}</Fieldset>
        <div style={{paddingBottom:'30px'}}>
            {parts.map((x:any,i) => <div key={i} style={{position: 'relative', marginBottom:'10px', top:'10px', left:'10px'}}>
                {x.icon}
                <span style={{
                    position: 'relative',
                    bottom: '12px',
                    verticalAlign: 'middle',
                    left: '15px'
                }}>{x.text}</span>
            </div>)}
        </div>
        <ButtonGroup>
            <Button type='button' secondary onClick={() => {
                if(props.cancelExport) props.cancelExport();
            }}>Cancel Export</Button>
        </ButtonGroup>
    </div>;
}