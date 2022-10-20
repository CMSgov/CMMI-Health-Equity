import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ExportConfigList } from './ExportConfigList';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/ExportConfigList',
  component: ExportConfigList,
} as ComponentMeta<typeof ExportConfigList>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ExportConfigList> = (args) => <ExportConfigList {...args} />;

export const Empty = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Empty.args = {
    api: {
        async getList() {
            return [];
        }
    }
};
