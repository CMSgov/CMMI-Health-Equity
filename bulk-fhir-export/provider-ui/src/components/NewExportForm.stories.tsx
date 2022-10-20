import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { NewExportForm } from './NewExportForm';
import { NewExport } from '../../../shared';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/NewExportForm',
  component: NewExportForm,
} as ComponentMeta<typeof NewExportForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof NewExportForm> = (args) => <NewExportForm {...args} />;

export const EmptyForm = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
EmptyForm.args = {
  config: {
    _id: 'new_form_id',
    label: 'Epic Export Config',
    exports: [{
        _id: 'export_2',
        startTime: new Date(),
        label: 'Export 2',
        statuses: [{
          status: 202,
          progress: '20% Complete',
          finished: false
        }]
    }]
  },
  onStart: async (form:NewExport) => {
        return {
            success: true
        };
    }
};
