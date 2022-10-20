import React, { useState } from 'react';

import '@trussworks/react-uswds/lib/uswds.css';
import '@trussworks/react-uswds/lib/index.css';

import { ExportConfig, NewExport, NewExportResult } from '../../../shared';
import { IconCheckCircle, Grid, GridContainer, IconCancel, IconRadioButtonUnchecked, IconSchedule, Fieldset, ButtonGroup, Button, Form, Label } from '@trussworks/react-uswds';
import { relative } from 'path';
import TextField from './TextField';

type NewExportFormProps = {
    config: ExportConfig,
    label?: string,
    exportResult?: NewExportResult,

    onStart: (newExport: NewExport) => Promise<NewExportResult>
};

export function NewExportForm(props: NewExportFormProps) {
    const {label:configLabel, _id} = props.config;
    const {onStart} = props;

    if(!_id) throw new Error('props.config._id is required');

    const [newExport,setNewExport] = useState<NewExport>({
        exportId: _id,
        label: configLabel || ''
    });
    const [exportResult, setExportResult] = useState<Partial<NewExportResult> | undefined>(props.exportResult);

    return <Form onSubmit={async (e) => {
        e.preventDefault();
        const result = await onStart(newExport);
        setExportResult(result);

    }}>
        <Fieldset legend='Start New Export' legendStyle='large'>
            <Label htmlFor='' className='text-bold'>Configuration:</Label>
            <div className='margin-top-1'>{configLabel}</div>
            <TextField label='Export Label' value={newExport.label} onChange={(e:any) => {
                setNewExport({...newExport, label: e.target.value});
            }}/>
            <ButtonGroup>
                <Button type='submit'>Start Export</Button>
            </ButtonGroup>
        </Fieldset>
    </Form>;
}