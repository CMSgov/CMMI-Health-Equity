import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ExportStatus } from './ExportStatus';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/ExportStatus',
  component: ExportStatus,
} as ComponentMeta<typeof ExportStatus>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ExportStatus> = (args) => <ExportStatus {...args} />;

export const ExportInProgress = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ExportInProgress.args = {
  exportId: 'export_2',
  config: {
    exports: [{
        _id: 'export_2',
        label: 'Export 2',
        startTime: new Date(),
        statuses: [{
          status: 202,
          progress: '20% Complete',
          finished: false
        }]
    }]
  },
  cancelExport: async () => {}
};

export const CompletedExport = Template.bind({});
CompletedExport.args={
  exportId: 'export_2',
  config: {
    label: 'Epic Export Config',
    exports: [{
        _id: 'export_2',
        label: 'Export 2',
        startTime: new Date(),
        statuses: [{
          finished: true
        }]
    }]
  },
  cancelExport: async () => {}
};

export const ErroredExport = Template.bind({});
ErroredExport.args={
  exportId: 'export_2',
  config: {
    label: 'Epic Export Config',
    exports: [{
        _id: 'export_2',
        label: 'Export 2',
        startTime: new Date(),
        statuses: [{
          error: [{
            message: 'there was an error exporting'
          }]
        }]
    }]
  },
  cancelExport: async () => {}
};
