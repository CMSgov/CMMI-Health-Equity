import { useEffect, useState } from "react";
import { Alert } from "@trussworks/react-uswds";
import TextField from "./TextField";
import { ConnectionTestResult, ExportConfig } from "../../../shared/";

type ExportConfigFormTypes = {
  config:ExportConfig;
  disableFields?: boolean;
  onChange?: (config: ExportConfig) => void;
  onSubmit?: (form: Object) => Promise<any>;
  onNavigate: (id: string) => void;
  testConfig?: (
    config: ExportConfig
  ) => Promise<ConnectionTestResult> | undefined;
  test?: ConnectionTestResult;
};

type TestErrorMessage = {
  invalid_client_id: string;
  invalid_auth_uri: string;
  invalid_fhir_uri: string;
};

const errorMessage: TestErrorMessage = {
  invalid_client_id: "Error: Invalid Client ID",
  invalid_fhir_uri: "Error: Invalid FHIR URI",
  invalid_auth_uri: "Error: Invalid Auth URI",
};

export function ExportConfigForm(props: ExportConfigFormTypes) {
  const { config, onChange, onSubmit, onNavigate, test, disableFields } = props;

  const [testResult, setTestResult] = useState<
    ConnectionTestResult | undefined
  >(test);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [current, setCurrent] = useState<ExportConfig>({})

  useEffect(() => {
    setCurrent(config ?? {});
  }, [JSON.stringify(config)]);

  const update = (u: any) => {
    const nValue = {
      ...current,
      ...u,
      connectionInformation: {
        ...current?.connectionInformation,
        ...u?.connectionInformation,
      },
      exportInformation: {
        ...current?.exportInformation,
        ...u?.exportInformation,
      },
    };

    setCurrent(nValue);
    if (onChange != null) onChange(nValue);
  };

  const canTest =
    (current?.connectionInformation?.authUrl?.length ?? 0) > 0 &&
    (current?.connectionInformation?.clientId?.length ?? 0) > 0 &&
    (current?.connectionInformation?.fhirUrl?.length ?? 0) > 0 &&
    (current?.exportInformation?.groupId?.length ?? 0) > 0;

  const canSave =
    current?.label &&
    ((canTest && testResult?.success === true) ||
      (!props.testConfig && !testResult && !canTest));
  // console.log(testResult);
  const testErrorMessage = (error: string) => {
    return errorMessage[error as keyof TestErrorMessage];
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (onSubmit != null && current != null) {
          const result = await onSubmit(current);
          onNavigate(result._id);
          setSaveSuccess(true);
        }
      }}
    >
      {testResult?.success && (
        <Alert type="success">
          The test has been successfully completed. Your EHR is able to send
          data to CMS.
        </Alert>
      )}
      {saveSuccess && (
        <Alert type="success">
          Your configuration has been added to Configurations.
        </Alert>
      )}

      {testResult?.error && (
        <Alert type="error">
          {console.log(testResult.error)}
          {testErrorMessage(Object.keys(testResult.error)[0])}
        </Alert>
      )}
      <fieldset className="usa-fieldset margin-bottom-4">
        <legend className="usa-legend usa-legend--large">
          Export configuration
        </legend>
        <p>
          Enter the appropriate data below to test and save an EHR
          configuration. Once that is complete, save the page’s URL to easily
          access the configuration and export history. To test and add a second
          configuration, repeat the steps above (the URLs of the two
          configurations will be different).
        </p>
        <TextField
          label="Configuration nickname"
          value={current?.label}
          onChange={(e: any) =>
            update({
              label: e.target.value,
            })
          }
          disabled={disableFields}
          tooltip={`Give your configuration a short name to remember the exports by (e.g. "Cerner: Batch A Exports").`}
        />
        <TextField
          label="Application client ID"
          value={current?.connectionInformation?.clientId}
          onChange={(e: any) =>
            update({
              connectionInformation: { clientId: e.target.value },
            })
          }
          error={
            testResult?.error?.invalid_client_id
              ? errorMessage.invalid_client_id
              : undefined
          }
          disabled={disableFields}
          tooltip="The public identifier of the application used to authenticate the FHIR bulk export. This is not a password."
        />
        <TextField
          label="FHIR URL"
          value={current?.connectionInformation?.fhirUrl}
          onChange={(e: any) =>
            update({
              connectionInformation: { fhirUrl: e.target.value },
            })
          }
          error={
            testResult?.error?.invalid_fhir_uri
              ? errorMessage.invalid_fhir_uri
              : undefined
          }
          disabled={disableFields}
          tooltip="The base URL to the FHIR server."
        />
        <TextField
          label="Authentication token URL"
          value={current?.connectionInformation?.authUrl}
          onChange={(e: any) =>
            update({
              connectionInformation: { authUrl: e.target.value },
            })
          }
          error={
            testResult?.error?.invalid_auth_uri
              ? errorMessage.invalid_auth_uri
              : undefined
          }
          disabled={disableFields}
          tooltip="The URL used to obtain a token in the FHIR bulk export process. It will likely end in “/auth.”"
        />
        <TextField
          label="Export group ID"
          value={current?.exportInformation?.groupId}
          onChange={(e: any) =>
            update({
              exportInformation: { groupId: e.target.value },
            })
          }
          disabled={disableFields}
          tooltip="The ID of the group to export from the EHR."
        />
        <button
          className="usa-button display-block margin-top-4"
          onClick={async (ev) => {
            ev.preventDefault();
            if (!props.testConfig || !current) return;
            console.log("testing config");
            console.log(current);
            const res = await props.testConfig(current);
            console.log("result: ", res);
            setTestResult(res);
          }}
          disabled={!canTest}
          hidden={props.testConfig == null}
        >
          Test configuration
        </button>
        <button
          className="usa-button display-block margin-top-2"
          type="submit"
          disabled={!canSave}
        >
          Save configuration
        </button>
      </fieldset>
    </form>
  );
}
