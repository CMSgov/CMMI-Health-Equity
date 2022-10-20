import { ExportConfigForm } from "./ExportConfigForm";
import { useParams } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import { ExportConfigServiceContext } from "..";
import ExportResults from "./ExportResults";
import ExportStartForm from "./ExportStartForm";

const hasInProgressExport = (config: { exports: { statuses: any[] }[] }) => {
  return config.exports
    .map((item: { statuses: any[] }) => item.statuses.slice(-1)[0])
    .flat()
    .find((status: { finished: any }) => !status.finished);
};

export default function ExportConfigPage(props: {
  onNavigate: (id: string) => void;
}) {
  const [config, setConfig] = useState<any>({});
  const api = React.useContext(ExportConfigServiceContext);

  const { onNavigate } = props;
  const { id } = useParams();

  const getConfig = useCallback(async () => {
    const config = await api.get(id!);
    setConfig(config);
  }, [api, id]);

  // Check if in progress exports need to be updated for Export Results.
  useEffect(() => {
    const interval = setInterval(() => {
      if (config.exports && hasInProgressExport(config)) getConfig();
    }, 1000);
    return () => clearInterval(interval);
  }, [config, getConfig]);

  // Use config if ID is in URL.
  useEffect(() => {
    if (id) getConfig();
  }, [getConfig, id]);

  const startExport = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const result: any = await api.export(config._id);
    if (result.configId) {
      const newConfig = await api.get(result.configId);
      setConfig(newConfig);
    }
  };

  const hasConfigSaved = config && config._id !== undefined;
  console.log(hasConfigSaved)
  return (
    <main>
      <ExportConfigForm
        config={config}
        disableFields={hasConfigSaved}
        onSubmit={async (form) =>
          config._id ? await api.update(form) : await api.create(form)
        }
        onNavigate={onNavigate}
        testConfig={(form) => {
          return api.validate(form);
        }}
      />
      <hr />
      <ExportResults
        configId={config._id}
        exports={config.exports}
        exportStartForm={
          <ExportStartForm
            label={hasConfigSaved ? config.label : ""}
            disable={!hasConfigSaved}
            handleSubmit={startExport}
          />
        }
      />
    </main>
  );
}
