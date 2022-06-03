import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import css from './ProgramListingPage.module.css';

const SectionHoursMaybe = props => {
  const { hours } = props;
  return hours ? (
    <div className={css.sectionHours}>
      <h2 className={css.hoursTitle}>
        <FormattedMessage id="ProgramListingPage.hoursTitle" />
      </h2>
      <p className={css.hours}>{hours} hours</p>
    </div>
  ) : null;
};

export default SectionHoursMaybe;
