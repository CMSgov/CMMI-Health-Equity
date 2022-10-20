import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import ExportResults from "./ExportResults";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/ExportResults",
  component: ExportResults,
} as ComponentMeta<typeof ExportResults>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ExportResults> = (args) => (
  <ExportResults {...args} />
);

export const Empty = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Empty.args = {
  exports: [],
};

export const MultipleExports = Template.bind({});
MultipleExports.args = {
  configId: "62756ed424dfb4d1f1370d62",
  exports: [
    { // Finished
      _id: "id",
      startTime: new Date(),
      statuses: [
        {
          status: 202,
          location:
            "http://bulk-data-server:9443/fhir/bulkstatus/5e1b61705ae775d43c170b8d4fb8150e",
        },
        {
          status: 200,
          location:
            "http://bulk-data-server:9443/fhir/bulkstatus/5e1b61705ae775d43c170b8d4fb8150e",
          finished: true,
          output: [
            {
              type: "Patient",
              count: 100,
              url: "http://bulk-data-server:9443/eyJpZCI6IjVlMWI2MTcwNWFlNzc1ZDQzYzE3MGI4ZDRmYjgxNTBlIiwib2Zmc2V0IjowLCJsaW1pdCI6MTAwLCJzZWN1cmUiOnRydWV9/fhir/bulkfiles/1.Patient.ndjson",
              localFile:
                "/home/node/app/build/provider-api/bulk-output-files/data.1651777923742.ndjson",
            },
          ],
        },
      ],
    },
    { // In progress
      _id: "id",
      startTime: new Date(),
      statuses: [
        {
          status: 202,
          location:
            "http://bulk-data-server:9443/fhir/bulkstatus/5e1b61705ae775d43c170b8d4fb8150e",

        },
      ],
    },
    { // Error
      _id: "id",
      startTime: new Date(),
      statuses: [
        {
          status: 202,
          error: [{
            message: "Error message"
          }],
        },
      ],
    },
  ],
};
