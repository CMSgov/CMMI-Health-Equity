import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import TextField from './TextField';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/TextField',
  component: TextField,
} as ComponentMeta<typeof TextField>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TextField> = (args) => <TextField {...args} />;

export const Empty = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Empty.args = {
  label: 'Text Field',
};

export const WithValue = Template.bind({});
WithValue.args = {
  label: 'With Value',
  value: 'A Test Value',
  name: 'with-value',
};

export const WithErrors = Template.bind({});
WithErrors.args = {
  label: 'With Value',
  value: 'A Test Value',
  name: 'with-value',
  error: 'Invalid Value'
};

export const ReadOnlyAndDisabled = Template.bind({});
ReadOnlyAndDisabled.args = {
  label: 'With Value',
  value: 'A Test Value',
  name: 'with-value',
  readOnly: true,
  disabled: true
};

export const WithTooltip = Template.bind({});
WithTooltip.args = {
    label: 'Label With Tooltip',
    tooltip: "This is a tooltip"
};