import React from 'react';
import { AvatarLarge, AvatarMedium, NamedLink } from '../../components';
import css from './ProgramListingPage.module.css';

const SectionAvatar = props => {
  const { user, params } = props;
  return (
    <div className={css.sectionAvatar}>
      <NamedLink name="ProgramListingPage" params={params} to={{ hash: '#host' }}>
        <AvatarLarge user={user} className={css.avatarDesktop} disableProfileLink />
      </NamedLink>
      <NamedLink name="ProgramListingPage" params={params} to={{ hash: '#host' }}>
        <AvatarMedium user={user} className={css.avatarMobile} disableProfileLink />
      </NamedLink>
    </div>
  );
};

export default SectionAvatar;
