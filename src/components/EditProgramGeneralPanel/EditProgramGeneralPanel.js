import classNames from 'classnames';
import { bool, func, object, string } from 'prop-types';
import React from 'react';
import { ListingLink } from '..';
import config from '../../config';
import EditProgramGeneralForm from '../../forms/EditProgramGeneralForm/EditProgramGeneralForm';
import { ensureOwnListing } from '../../util/data';
import { FormattedMessage } from '../../util/reactIntl';
import { findOptionsForSelectFilter } from '../../util/search';
import { LISTING_STATE_DRAFT } from '../../util/types';
import css from './EditProgramGeneralPanel.module.css';

const EditProgramGeneralPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { description, title, publicData } = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditProgramGeneralPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditProgramGeneralPanel.createListingTitle" />
  );

  const difficultyOptions = findOptionsForSelectFilter(
    'programDifficulties',
    config.custom.filters
  );

  const { programTags, programDifficulties, isCustomHour, hours } = publicData;
  const { CUSTOM_HOUR, DEFAULT_HOUR } = config;

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditProgramGeneralForm
        className={css.form}
        initialValues={{
          title,
          description,
          programTags: programTags,
          programDifficulties: programDifficulties,
          isCustomHour: !!isCustomHour,
          customHours: hours || DEFAULT_HOUR,
          hoursChoices: isCustomHour ? CUSTOM_HOUR : hours || DEFAULT_HOUR,
        }}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const {
            title,
            description,
            programTags,
            programDifficulties,
            hoursChoices,
            customHours,
          } = values;
          const isCustomHour = hoursChoices === CUSTOM_HOUR;
          const updateValues = {
            title: title.trim(),
            description,
            publicData: {
              programTags,
              programDifficulties,
              hours: parseInt(isCustomHour ? customHours : hoursChoices),
              isCustomHour,
            },
          };

          onSubmit(updateValues);
        }}
        onChange={onChange}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
        difficultyOptions={difficultyOptions}
      />
    </div>
  );
};

EditProgramGeneralPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  listing: null,
};

EditProgramGeneralPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditProgramGeneralPanel;
