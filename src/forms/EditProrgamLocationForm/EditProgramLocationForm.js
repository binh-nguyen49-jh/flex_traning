import React, { useState } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import {
  autocompleteSearchRequired,
  autocompletePlaceSelected,
  composeValidators,
} from '../../util/validators';
import {
  Form,
  LocationAutocompleteInputField,
  Button,
  FieldTextInput,
  FieldCheckbox,
  FieldCheckboxGroup,
} from '../../components';

import css from './EditProgramLocationForm.module.css';
import { ONLINE, ONSITE } from '../../marketplace-custom-config';
import { findOptionsForSelectFilter } from '../../util/search';
import arrayMutators from 'final-form-arrays';
import config from '../../config';

const identity = v => v;

export const EditProgramLocationFormComponent = props => {
  const { initialValues } = props;
  const [teachingForm, setTeachingForm] = useState({
    [ONLINE]: false || initialValues.teachingForm?.includes(ONLINE),
    [ONSITE]: false || initialValues.teachingForm?.includes(ONSITE),
  });

  const handleClickTeachForm = option => {
    setTeachingForm(oldTeachingForm => {
      oldTeachingForm[option.target.value] = !oldTeachingForm[option.target.value];
      return oldTeachingForm;
    });
  };

  return (
    <FinalForm
      {...props}
      mutators={{ ...arrayMutators }}
      render={formRenderProps => {
        const {
          className,
          disabled,
          ready,
          handleSubmit,
          intl,
          invalid,
          pristine,
          saveActionMsg,
          updated,
          updateInProgress,
          fetchErrors,
          values,
        } = formRenderProps;

        const titleRequiredMessage = intl.formatMessage({ id: 'EditProgramLocationForm.address' });
        const addressPlaceholderMessage = intl.formatMessage({
          id: 'EditProgramLocationForm.addressPlaceholder',
        });
        const addressRequiredMessage = intl.formatMessage({
          id: 'EditProgramLocationForm.addressRequired',
        });
        const addressNotRecognizedMessage = intl.formatMessage({
          id: 'EditProgramLocationForm.addressNotRecognized',
        });

        const optionalText = intl.formatMessage({
          id: 'EditProgramLocationForm.optionalText',
        });

        const buildingMessage = intl.formatMessage(
          { id: 'EditProgramLocationForm.building' },
          { optionalText: optionalText }
        );
        const buildingPlaceholderMessage = intl.formatMessage({
          id: 'EditProgramLocationForm.buildingPlaceholder',
        });

        const { updateListingError, showListingsError } = fetchErrors || {};
        const errorMessage = updateListingError ? (
          <p className={css.error}>
            <FormattedMessage id="EditProgramLocationForm.updateFailed" />
          </p>
        ) : null;

        const errorMessageShowListing = showListingsError ? (
          <p className={css.error}>
            <FormattedMessage id="EditProgramLocationForm.showListingFailed" />
          </p>
        ) : null;

        const classes = classNames(css.root, className);
        const submitReady = (updated && pristine) || ready;
        const submitInProgress = updateInProgress;
        const submitDisabled = invalid || disabled || submitInProgress;
        const options = findOptionsForSelectFilter('teachingForm', config.custom.filters);

        return (
          <Form className={classes} onSubmit={handleSubmit}>
            {errorMessage}
            {errorMessageShowListing}

            <div className={css.teachingForm}>
              {options.map(option => (
                <FieldCheckbox
                  id={option.key}
                  name="teachingForm"
                  label={option.label}
                  value={option.key}
                  key={option.key}
                  onClick={handleClickTeachForm}
                />
              ))}
            </div>

            {teachingForm[ONSITE] && (
              <>
                <LocationAutocompleteInputField
                  className={css.locationAddress}
                  inputClassName={css.locationAutocompleteInput}
                  iconClassName={css.locationAutocompleteInputIcon}
                  predictionsClassName={css.predictionsRoot}
                  validClassName={css.validLocation}
                  autoFocus
                  name="location"
                  label={titleRequiredMessage}
                  placeholder={addressPlaceholderMessage}
                  useDefaultPredictions={false}
                  format={identity}
                  valueFromForm={values.location}
                  validate={composeValidators(
                    autocompleteSearchRequired(addressRequiredMessage),
                    autocompletePlaceSelected(addressNotRecognizedMessage)
                  )}
                />

                <FieldTextInput
                  className={css.building}
                  type="text"
                  name="building"
                  id="building"
                  label={buildingMessage}
                  placeholder={buildingPlaceholderMessage}
                />
              </>
            )}

            <Button
              className={css.submitButton}
              type="submit"
              inProgress={submitInProgress}
              disabled={submitDisabled}
              ready={submitReady}
            >
              {saveActionMsg}
            </Button>
          </Form>
        );
      }}
    />
  );
};

EditProgramLocationFormComponent.defaultProps = {
  selectedPlace: null,
  fetchErrors: null,
};

EditProgramLocationFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  selectedPlace: propTypes.place,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditProgramLocationFormComponent);
