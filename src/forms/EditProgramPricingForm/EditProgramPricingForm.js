import React, { useState } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import config from '../../config';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY, propTypes } from '../../util/types';
import * as validators from '../../util/validators';
import { formatMoney } from '../../util/currency';
import { types as sdkTypes } from '../../util/sdkLoader';
import { Button, Form, FieldCurrencyInput, FieldSelect } from '../../components';
import css from './EditProgramPricingForm.module.css';

const { Money } = sdkTypes;

export const EditProgramPricingFormComponent = props => {
  const { initialValues } = props;
  const { priceChoices, PACKAGE_PRICE, HOURLY_PRICE } = config;
  const [priceOption, setPriceOption] = useState(initialValues?.priceChoices || PACKAGE_PRICE);
  const [totalPrice, setTotalPrice] = useState(
    initialValues.price ? initialValues.price : new Money(0, config.currency)
  );
  const hours = (initialValues && initialValues.hours) || 1;

  return (
    <FinalForm
      {...props}
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
        } = formRenderProps;

        const pricePerUnitMessage = intl.formatMessage({
          id: 'EditProgramPricingForm.pricePerUnit',
        });

        const pricePerHourMessage = intl.formatMessage({
          id: 'EditProgramPricingForm.pricePerHour',
        });

        const priceForPackageMessage = intl.formatMessage({
          id: 'EditProgramPricingForm.priceForPackage',
        });

        const pricePlaceholderMessage = intl.formatMessage({
          id: 'EditProgramPricingForm.priceInputPlaceholder',
        });

        const priceLabelDict = {
          [PACKAGE_PRICE]: priceForPackageMessage,
          [HOURLY_PRICE]: pricePerHourMessage,
        };

        const priceRequired = validators.required(
          intl.formatMessage({
            id: 'EditProgramPricingForm.priceRequired',
          })
        );
        const minPrice = new Money(config.listingMinimumPriceSubUnits, config.currency);
        const minPriceRequired = validators.moneySubUnitAmountAtLeast(
          intl.formatMessage(
            {
              id: 'EditProgramPricingForm.priceTooLow',
            },
            {
              minPrice: formatMoney(intl, minPrice),
            }
          ),
          config.listingMinimumPriceSubUnits
        );
        const priceValidators = config.listingMinimumPriceSubUnits
          ? validators.composeValidators(priceRequired, minPriceRequired)
          : priceRequired;

        const classes = classNames(css.root, className);
        const submitReady = (updated && pristine) || ready;
        const submitInProgress = updateInProgress;
        const submitDisabled = invalid || disabled || submitInProgress;
        const { updateListingError, showListingsError } = fetchErrors || {};
        const handleClickOption = option => {
          setPriceOption(option.target.value);
        };
        return (
          <Form onSubmit={handleSubmit} className={classes}>
            {updateListingError ? (
              <p className={css.error}>
                <FormattedMessage id="EditProgramPricingForm.updateFailed" />
              </p>
            ) : null}
            {showListingsError ? (
              <p className={css.error}>
                <FormattedMessage id="EditProgramPricingForm.showListingFailed" />
              </p>
            ) : null}

            <FormSpy
              onChange={formState => {
                const price = formState.values.price ? formState.values.price.amount : 0;
                if (priceOption === HOURLY_PRICE) {
                  setTotalPrice(price * hours);
                } else {
                  setTotalPrice(price);
                }
              }}
            />

            <FieldSelect
              className={css.priceChoices}
              name="priceChoices"
              id="priceChoices"
              label={'Pricing option'}
            >
              {priceChoices.map(o => (
                <option onClick={handleClickOption} key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </FieldSelect>

            <FieldCurrencyInput
              id="price"
              name="price"
              className={css.priceInput}
              autoFocus
              label={
                priceLabelDict[priceOption] ? priceLabelDict[priceOption] : pricePerUnitMessage
              }
              placeholder={pricePlaceholderMessage}
              currencyConfig={config.currencyConfig}
              validate={priceValidators}
            />

            <div className={css.totalPrice}>
              <div className={css.totalPriceLabel}>
                <FormattedMessage id="EditProgramPricingForm.totalPrice" />
              </div>
              <p className={css.totalPriceValue}>{formatMoney(intl, totalPrice)}</p>
            </div>

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

EditProgramPricingFormComponent.defaultProps = { fetchErrors: null };

EditProgramPricingFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditProgramPricingFormComponent);
