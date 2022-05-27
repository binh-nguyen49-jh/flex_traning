/* eslint-disable no-console */
import EditProgramLocationForm from './EditProgramLocationForm';

export const Empty = {
  component: EditProgramLocationForm,
  props: {
    onSubmit: values => {
      console.log('Submit EditProgramLocationForm with (unformatted) values:', values);
    },
    saveActionMsg: 'Save location',
    updated: false,
    updateInProgress: false,
    disabled: false,
    ready: false,
  },
  group: 'forms',
};
