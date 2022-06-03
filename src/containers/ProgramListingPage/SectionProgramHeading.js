import React from 'react';
import { InlineTextButton } from '../../components';
import config from '../../config';
import { FormattedMessage } from '../../util/reactIntl';
import css from './ProgramListingPage.module.css';

const SectionProgramHeading = props => {
  const {
    priceTitle,
    formattedPrice,
    richTitle,
    category,
    hostLink,
    showContactUser,
    onContactUser,
    pricingOption,
    limitedQuantity,
  } = props;

  const isPackage = pricingOption === config.PACKAGE_PRICE;
  const isHourly = pricingOption === config.HOURLY_PRICE;

  const unitTranslationKey = isPackage
    ? 'ProgramListingPage.perPackage'
    : isHourly
    ? 'ProgramListingPage.perHour'
    : 'ProgramListingPage.perUnit';

  return (
    <div className={css.sectionHeading}>
      <div className={css.desktopPriceContainer}>
        <div className={css.desktopPriceValue} title={priceTitle}>
          {formattedPrice}
        </div>
        <div className={css.desktopPerUnit}>
          <FormattedMessage id={unitTranslationKey} />
          {isPackage && <p>Limit {limitedQuantity} packages</p>}
        </div>
      </div>
      <div className={css.heading}>
        <h1 className={css.title}>{richTitle}</h1>
        <div className={css.author}>
          {category}
          <FormattedMessage id="ProgramListingPage.hostedBy" values={{ name: hostLink }} />
          {showContactUser ? (
            <span className={css.contactWrapper}>
              <span className={css.separator}>•</span>
              <InlineTextButton
                rootClassName={css.contactLink}
                onClick={onContactUser}
                enforcePagePreloadFor="SignupPage"
              >
                <FormattedMessage id="ProgramListingPage.contactUser" />
              </InlineTextButton>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SectionProgramHeading;
