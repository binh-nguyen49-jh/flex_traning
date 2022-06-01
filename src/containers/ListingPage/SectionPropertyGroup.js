import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';

import css from './ListingPage.module.css';

const SectionPropertyGroup = props => {
  const { titleMessageId, options, selectedOptions, ...rest } = props;

  return (
    <div className={css.sectionDifficulty}>
      <h2 className={css.featuresTitle}>
        <FormattedMessage id={titleMessageId} />
      </h2>
      <PropertyGroup options={options} selectedOptions={selectedOptions} {...rest} />
    </div>
  );
};

export default SectionPropertyGroup;
