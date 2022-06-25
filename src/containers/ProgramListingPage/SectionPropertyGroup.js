import React from 'react';
import { PropertyGroup } from '../../components';
import { FormattedMessage } from '../../util/reactIntl';
import css from './ProgramListingPage.module.css';

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
