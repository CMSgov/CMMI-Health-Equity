import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ExportConfigForm } from './ExportConfigForm';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/ExportConfigForm',
  component: ExportConfigForm,
} as ComponentMeta<typeof ExportConfigForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ExportConfigForm> = (args) => <ExportConfigForm {...args} />;

export const EmptyForm = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
EmptyForm.args = {
};

const config = {
  label: 'New Export Config',
  connectionInformation: {
    authUrl: 'http://fhir.test.org/authenticate',
    clientId: '123456789',
    fhirUrl: 'http://fhir.test.org'
  },
  exportInformation: {
    groupId: 'group:test:100'
  }
};

export const CompletedForm = Template.bind({});
CompletedForm.args = {
  config
};

export const InvalidClientIdError = Template.bind({});
InvalidClientIdError.args = {
  config,
  test: {
    success: false,
    error: {
      invalid_client_id: true
    }
  }
}

export const InvalidFhirUriError = Template.bind({});
InvalidFhirUriError.args = {
  config,
  test: {
    success: false,
    error: {
      invalid_fhir_uri: true
    }
  }
}

export const InvalidAuthUriError = Template.bind({});
InvalidAuthUriError.args = {
  config,
  test: {
    success: false,
    error: {
      invalid_auth_uri: true
    }
  }
}