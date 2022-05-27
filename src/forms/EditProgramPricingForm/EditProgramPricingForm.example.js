/* eslint-disable no-console */
import EditProgramPricingForm from './EditProgramPricingForm';

export const Empty = {
  component: EditProgramPricingForm,
  props: {
    onSubmit: values => {
      console.log('Submit EditProgramPricingForm with (unformatted) values:', values);
    },
    saveActionMsg: 'Save price',
    updated: false,
    updateInProgress: false,
    disabled: false,
    ready: false,
  },
  group: 'forms',
};
