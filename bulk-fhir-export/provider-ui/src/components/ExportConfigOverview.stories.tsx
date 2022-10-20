import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ExportConfigOverview from './ExportConfigOverview';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/ExportConfigOverview',
  component: ExportConfigOverview,
} as ComponentMeta<typeof ExportConfigOverview>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ExportConfigOverview> = (args) => <ExportConfigOverview {...args} />;

export const FilledEntries = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
FilledEntries.args = {
    config: {
        label: 'Test Connection',
        connectionInformation: {
            clientId: 'ClientIDHere',
            fhirUrl: 'http://fhir.com',
            authUrl: "http://authg.com"
        },
        exportInformation: {
            groupId: 'GroupId1'
        }
    }
};
