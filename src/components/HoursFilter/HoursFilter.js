import React from 'react';
import { bool } from 'prop-types';
import HoursFilterPlain from './HoursFilterPlain';
import HoursFilterPopup from './HoursFilterPopup';

const HoursFilter = props => {
  const { showAsPopup, ...rest } = props;
  return showAsPopup ? <HoursFilterPopup {...rest} /> : <HoursFilterPlain {...rest} />;
};

HoursFilter.defaultProps = {
  showAsPopup: false,
};

HoursFilter.propTypes = {
  showAsPopup: bool,
};

export default HoursFilter;
