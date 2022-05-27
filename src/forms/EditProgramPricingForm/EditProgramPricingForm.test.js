import React from 'react';
import { renderDeep } from '../../util/test-helpers';
import { fakeIntl } from '../../util/test-data';
import EditProgramPricingForm from './EditProgramPricingForm';

const noop = () => null;

describe('EditProgramPricingForm', () => {
  it('matches snapshot', () => {
    const tree = renderDeep(
      <EditProgramPricingForm
        intl={fakeIntl}
        dispatch={noop}
        onSubmit={v => v}
        saveActionMsg="Save price"
        updated={false}
        updateInProgress={false}
        disabled={false}
        ready={false}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
