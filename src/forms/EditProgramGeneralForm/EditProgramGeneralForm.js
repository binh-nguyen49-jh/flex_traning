import React, { useState } from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import arrayMutators from 'final-form-arrays';
import { propTypes } from '../../util/types';
import {
  maxLength,
  required,
  composeValidators,
  requiredFieldArrayCheckbox,
  validNumber,
} from '../../util/validators';
import { Form, Button, FieldTextInput, FieldCheckboxGroup, FieldSelect } from '../../components';
import config from '../../config';
import css from './EditProgramGeneralForm.module.css';

const TITLE_MAX_LENGTH = 60;

const EditProgramGeneralFormComponent = props => {
  const [isChoosingCustomHours, setChoosingCustomHours] = useState(false);
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
          difficultyOptions,
        } = formRenderProps;
        const { hoursChoices, CUSTOM_HOUR } = config;

        const titleMessage = intl.formatMessage({ id: 'EditProgramGeneralForm.title' });
        const titlePlaceholderMessage = intl.formatMessage({
          id: 'EditProgramGeneralForm.titlePlaceholder',
        });
        const titleRequiredMessage = intl.formatMessage({
          id: 'EditProgramGeneralForm.titleRequired',
        });
        const maxLengthMessage = intl.formatMessage(
          { id: 'EditProgramGeneralForm.maxLength' },
          {
            maxLength: TITLE_MAX_LENGTH,
          }
        );

        const maxLength60Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH);
        const descriptionMessage = intl.formatMessage({
          id: 'EditProgramGeneralForm.description',
        });
        const descriptionPlaceholderMessage = intl.formatMessage({
          id: 'EditProgramGeneralForm.descriptionPlaceholder',
        });
        const descriptionRequiredMessage = intl.formatMessage({
          id: 'EditProgramGeneralForm.descriptionRequired',
        });

        const hoursMessage = intl.formatMessage({
          id: 'EditProgramGeneralForm.hours',
        });
        const hoursPlaceholderMessage = intl.formatMessage({
          id: 'EditProgramGeneralForm.hoursPlaceholder',
        });
        const hoursRequiredMessage = intl.formatMessage({
          id: 'EditProgramGeneralForm.hoursRequired',
        });
        const hoursNumber = intl.formatMessage({
          id: 'EditProgramGeneralForm.hoursNumber',
        });

        const programTagsMessage = intl.formatMessage({
          id: 'EditProgramGeneralForm.programTags',
        });
        const programTagsPlaceholderMessage = intl.formatMessage({
          id: 'EditProgramGeneralForm.programTagsPlaceholder',
        });
        const programTagsRequiredMessage = intl.formatMessage({
          id: 'EditProgramGeneralForm.programTagsRequired',
        });
        const programDifficultyRequiredMessage = intl.formatMessage({
          id: 'EditProgramGeneralForm.programDifficultyRequired',
        });

        const { updateListingError, createListingDraftError, showListingsError } =
          fetchErrors || {};
        const errorMessageUpdateListing = updateListingError ? (
          <p className={css.error}>
            <FormattedMessage id="EditProgramGeneralForm.updateFailed" />
          </p>
        ) : null;

        // This error happens only on first tab (of EditListingWizard)
        const errorMessageCreateListingDraft = createListingDraftError ? (
          <p className={css.error}>
            <FormattedMessage id="EditProgramGeneralForm.createListingDraftError" />
          </p>
        ) : null;

        const errorMessageShowListing = showListingsError ? (
          <p className={css.error}>
            <FormattedMessage id="EditProgramGeneralForm.showListingFailed" />
          </p>
        ) : null;

        const classes = classNames(css.root, className);
        const submitReady = (updated && pristine) || ready;
        const submitInProgress = updateInProgress;
        const submitDisabled = invalid || disabled || submitInProgress;

        const handleClickOption = option => {
          setChoosingCustomHours(option.target.value === CUSTOM_HOUR);
        };

        return (
          <Form className={classes} onSubmit={handleSubmit}>
            {errorMessageCreateListingDraft}
            {errorMessageUpdateListing}
            {errorMessageShowListing}
            <FieldTextInput
              id="title"
              name="title"
              className={css.title}
              type="text"
              label={titleMessage}
              placeholder={titlePlaceholderMessage}
              maxLength={TITLE_MAX_LENGTH}
              validate={composeValidators(required(titleRequiredMessage), maxLength60Message)}
              autoFocus
            />
            <FieldTextInput
              id="description"
              name="description"
              className={css.description}
              type="textarea"
              label={descriptionMessage}
              placeholder={descriptionPlaceholderMessage}
              validate={composeValidators(required(descriptionRequiredMessage))}
            />
            <FieldTextInput
              id="programTags"
              name="programTags"
              className={css.programTags}
              type="textarea"
              label={programTagsMessage}
              placeholder={programTagsPlaceholderMessage}
              validate={composeValidators(required(programTagsRequiredMessage))}
            />
            <FieldCheckboxGroup
              options={difficultyOptions}
              className={css.programDifficulties}
              label="Program Difficulties"
              id="programDifficulties"
              name="programDifficulties"
              validate={requiredFieldArrayCheckbox(programDifficultyRequiredMessage)}
            />
            <FieldSelect
              className={css.hours}
              name="hoursChoices"
              id="hoursChoices"
              label={'Hours'}
            >
              {hoursChoices.map(o => (
                <option onClick={handleClickOption} key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </FieldSelect>
            {isChoosingCustomHours && (
              <FieldTextInput
                id="hours"
                name="hours"
                className={css.hours}
                type="number"
                label={hoursMessage}
                placeholder={hoursPlaceholderMessage}
                validate={composeValidators(
                  validNumber(hoursNumber),
                  required(hoursRequiredMessage)
                )}
              />
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

EditProgramGeneralFormComponent.defaultProps = { className: null, fetchErrors: null };

EditProgramGeneralFormComponent.propTypes = {
  className: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    createListingDraftError: propTypes.error,
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  categories: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ),
};

export default compose(injectIntl)(EditProgramGeneralFormComponent);
