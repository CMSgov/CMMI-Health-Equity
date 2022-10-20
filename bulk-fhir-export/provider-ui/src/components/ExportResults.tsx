import "../styles/export-results.css";
import "@trussworks/react-uswds/lib/uswds.css";
import "@trussworks/react-uswds/lib/index.css";
import ExportStatusIcon from "./ExportStatusIcon";
import { BulkExport, ExportStatus } from "../../../shared";
import DownloadFileButton from "./DownloadFileButton";
import { ExportConfigServiceContext } from "..";
import React from "react";

const getStatus = (exportStatus: ExportStatus) => {
  let status;
  if (exportStatus?.error) status = "Cancelled";
  else if (exportStatus?.finished) status = "Submitted";
  else status = "In progress";
  return status;
};

export default function ExportResults(props: {
  exportStartForm?: JSX.Element;
  exports: BulkExport[];
  configId: string;
}) {
  const { exportStartForm, exports, configId } = props;
  const rawExports = exports ? exports : [];
  const api = React.useContext(ExportConfigServiceContext);

  const exportResults = rawExports.map((x: any, i: number) => {
    const lastExport = x?.statuses?.slice(-1)?.[0];
    const count = lastExport?.output ? lastExport.output[0].count : "";
    const date = x.startTime ? new Date(x.startTime) : ""
    const localDate = date.toLocaleString()
    return {
      id: x?._id,
      label: x.label,
      time: localDate,
      status: getStatus(lastExport!),
      count,
      url: lastExport.finished && api ? api.getFileUrl(configId, i) : null,
    };
  });

  return (
    <div>
      {exportStartForm && exportStartForm}
      <table className="usa-table usa-table--borderless">
        <thead>
          <tr className="bordered-row">
            <th role="columnheader" scope="col">
              Status
            </th>
            <th role="columnheader" scope="col">
              Export Time
            </th>
            <th role="columnheader" scope="col">
              No. of Records
            </th>
            <th role="columnheader" scope="col">
              Download
            </th>
          </tr>
        </thead>
        <tbody>
          {exportResults.map((x: any, i: any) => (
            <tr className="bordered-row" key={x.id || i}>
              <td>
                <ExportStatusIcon status={x.status} />
                {x.status}
              </td>
              <td>{x.time}</td>
              <td>{x.count}</td>
              <td>{x.url && <DownloadFileButton link={x.url} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
