import React from 'react';
import { Reviews } from '../../components';
import { FormattedMessage } from '../../util/reactIntl';
import css from './ProgramListingPage.module.css';

const SectionReviews = props => {
  const { reviews, fetchReviewsError } = props;

  const reviewsError = (
    <h2 className={css.errorText}>
      <FormattedMessage id="ListingPage.reviewsError" />
    </h2>
  );

  return (
    <div className={css.sectionReviews}>
      <h2 className={css.reviewsHeading}>
        <FormattedMessage id="ListingPage.reviewsHeading" values={{ count: reviews.length }} />
      </h2>
      {fetchReviewsError ? reviewsError : null}
      <Reviews reviews={reviews} />
    </div>
  );
};

export default SectionReviews;
