import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ListingLink } from '..';
import EditProgramLocationForm from '../../forms/EditProrgamLocationForm/EditProgramLocationForm';
import { ONSITE } from '../../marketplace-custom-config';
import { ensureOwnListing } from '../../util/data';
import { FormattedMessage } from '../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../util/types';
import css from './EditProgramLocationPanel.module.css';

class EditProgramLocationPanel extends Component {
  constructor(props) {
    super(props);

    this.getInitialValues = this.getInitialValues.bind(this);

    this.state = {
      initialValues: this.getInitialValues(),
    };
  }

  getInitialValues() {
    const { listing } = this.props;
    const currentListing = ensureOwnListing(listing);
    const { geolocation, publicData } = currentListing.attributes;

    // Only render current search if full place object is available in the URL params
    // TODO bounds are missing - those need to be queried directly from Google Places
    const locationFieldsPresent =
      publicData && publicData.location && publicData.location.address && geolocation;
    const location = publicData && publicData.location ? publicData.location : {};
    const { address, building } = location;
    const teachingForm = publicData && publicData.teachingForm;
    return {
      teachingForm,
      building,
      location: locationFieldsPresent
        ? {
            search: address,
            selectedPlace: { address, origin: geolocation },
          }
        : null,
    };
  }

  render() {
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
    } = this.props;

    const classes = classNames(rootClassName || css.root, className);
    const currentListing = ensureOwnListing(listing);

    const isPublished =
      currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
    const panelTitle = isPublished ? (
      <FormattedMessage
        id="EditProgramLocationPanel.title"
        values={{ listingTitle: <ListingLink listing={listing} /> }}
      />
    ) : (
      <FormattedMessage id="EditProgramLocationPanel.createListingTitle" />
    );

    return (
      <div className={classes}>
        <h1 className={css.title}>{panelTitle}</h1>
        <EditProgramLocationForm
          className={css.form}
          initialValues={this.state.initialValues}
          onSubmit={values => {
            const { teachingForm, building = '', location } = values;
            if (teachingForm.includes(ONSITE)) {
              const {
                selectedPlace: { address, origin },
              } = location;
              const updateValues = {
                geolocation: origin,
                publicData: {
                  teachingForm,
                  location: { address, building },
                },
              };
              this.setState({
                initialValues: {
                  building,
                  teachingForm,
                  location: { search: address, selectedPlace: { address, origin } },
                },
              });
              onSubmit(updateValues);
            } else {
              const updateValues = {
                publicData: {
                  teachingForm,
                  location: null,
                },
              };
              this.setState({
                initialValues: {
                  teachingForm,
                  location: null,
                },
              });
              onSubmit(updateValues);
            }
          }}
          onChange={onChange}
          saveActionMsg={submitButtonText}
          disabled={disabled}
          ready={ready}
          updated={panelUpdated}
          updateInProgress={updateInProgress}
          fetchErrors={errors}
        />
      </div>
    );
  }
}

const { func, object, string, bool } = PropTypes;

EditProgramLocationPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditProgramLocationPanel.propTypes = {
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

export default EditProgramLocationPanel;
