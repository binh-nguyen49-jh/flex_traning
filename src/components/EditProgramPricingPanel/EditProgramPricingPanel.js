import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { ListingLink } from '..';
import config from '../../config';
import EditProgramPricingForm from '../../forms/EditProgramPricingForm/EditProgramPricingForm';
import { ensureOwnListing } from '../../util/data';
import { FormattedMessage } from '../../util/reactIntl';
import { types as sdkTypes } from '../../util/sdkLoader';
import { LISTING_STATE_DRAFT } from '../../util/types';
import css from './EditProgramPricingPanel.module.css';

const { Money } = sdkTypes;

const EditProgramPricingPanel = props => {
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
  const { price } = currentListing.attributes;
  const { hours, pricingOption, limitedQuantity } = currentListing.attributes.publicData;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditProgramPricingPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditProgramPricingPanel.createListingTitle" />
  );

  const priceCurrencyValid = price instanceof Money ? price.currency === config.currency : true;
  const form = priceCurrencyValid ? (
    <EditProgramPricingForm
      className={css.form}
      initialValues={{
        price,
        hours,
        pricingOption: pricingOption || config.HOURLY_PRICE,
        limitedQuantity,
      }}
      onSubmit={values => {
        const { pricingOption, price, limitedQuantity } = values;
        const updateValues = {
          price,
          publicData: {
            pricingOption,
          },
        };
        if (pricingOption === config.PACKAGE_PRICE) {
          updateValues.publicData.limitedQuantity = limitedQuantity;
        }
        onSubmit(updateValues);
      }}
      onChange={onChange}
      saveActionMsg={submitButtonText}
      disabled={disabled}
      ready={ready}
      updated={panelUpdated}
      updateInProgress={updateInProgress}
      fetchErrors={errors}
    />
  ) : (
    <div className={css.priceCurrencyInvalid}>
      <FormattedMessage id="EditProgramPricingPanel.listingPriceCurrencyInvalid" />
    </div>
  );

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      {form}
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditProgramPricingPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditProgramPricingPanel.propTypes = {
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

export default EditProgramPricingPanel;
