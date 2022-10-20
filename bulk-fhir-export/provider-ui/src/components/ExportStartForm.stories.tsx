import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import  ExportStartForm  from './ExportStartForm';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/ExportStartForm',
  component: ExportStartForm,
} as ComponentMeta<typeof ExportStartForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ExportStartForm> = (args) => <ExportStartForm {...args} />;

export const Empty = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Empty.args = {
  disable: true,
  label: ""
};

export const DisabledWithLabel = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
DisabledWithLabel.args = {
  disable: true,
  label: "Config nickname"
};


export const ReadyExportStartForm = Template.bind({});
ReadyExportStartForm.args={
  disable: false,
  label: "Config nickname"
};