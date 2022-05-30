import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '..';
import { ensureOwnListing } from '../../util/data';
import { types as sdkTypes } from '../../util/sdkLoader';
import config from '../../config';

import css from './EditProgramPricingPanel.module.css';
import EditProgramPricingForm from '../../forms/EditProgramPricingForm/EditProgramPricingForm';

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
  const { hours, priceChoices, limitedQuantity } = currentListing.attributes.publicData;

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
        priceChoices: priceChoices || config.HOURLY_PRICE,
        limitedQuantity,
      }}
      onSubmit={values => {
        const { priceChoices, price, limitedQuantity } = values;
        const updateValues = {
          price,
          publicData: {
            priceChoices,
          },
        };
        if (priceChoices === config.PACKAGE_PRICE) {
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
