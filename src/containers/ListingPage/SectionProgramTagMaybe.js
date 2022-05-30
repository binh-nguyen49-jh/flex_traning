import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { richText } from '../../util/richText';

import css from './ListingPage.module.css';

const MIN_LENGTH_FOR_LONG_WORDS_IN_DESCRIPTION = 40;

const SectionProgramTagMaybe = props => {
  const { programTags } = props;
  return programTags ? (
    <div className={css.sectionProgramTags}>
      <h2 className={css.programTagsTitle}>
        <FormattedMessage id="ProgramListingPage.programTagsTitle" />
      </h2>
      <p className={css.programTags}>
        {richText(programTags, {
          longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS_IN_DESCRIPTION,
          longWordClass: css.longWord,
        })}
      </p>
    </div>
  ) : null;
};

export default SectionProgramTagMaybe;
