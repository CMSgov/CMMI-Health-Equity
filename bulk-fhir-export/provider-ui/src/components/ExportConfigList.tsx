import React, { useEffect, useState } from 'react';

import {
    ExportConfig
} from '../../../shared/';
import { ExportConfigServiceApi } from '../api';

export function ExportConfigList(props:{api?:{
    getList: () => Promise<ExportConfig[]>
}}) {
    const [list,setList] = useState<ExportConfig[]>([]);
    const {api}=props;
    useEffect(() => {
        if(!api) {
            console.log('not fetching list');
            return;
        }
        const fn = async () => {
            console.log('fetching list');
            setList(await api.getList());
        };
        fn();
    }, [api]);

    return <div>
        {JSON.stringify(list)}
    </div>;
}
