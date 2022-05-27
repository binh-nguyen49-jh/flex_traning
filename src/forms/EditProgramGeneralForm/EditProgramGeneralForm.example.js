/* eslint-disable no-console */
import EditProgramGeneralForm from './EditProgramGeneralForm';

export const Empty = {
  component: EditProgramGeneralForm,
  props: {
    onSubmit: values => {
      console.log('Submit EditProgramGeneralForm with (unformatted) values:', values);
    },
    saveActionMsg: 'Save description',
    updated: false,
    updateInProgress: false,
    disabled: false,
    ready: false,
  },
  group: 'forms',
};
