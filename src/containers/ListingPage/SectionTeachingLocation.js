import React, { Component } from 'react';
import { array, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { obfuscatedCoordinates } from '../../util/maps';
import { Map, PropertyGroup } from '../../components';
import config from '../../config';

import css from './ListingPage.module.css';
import { ONSITE } from '../../marketplace-custom-config';

class SectionTeachingLocationMaybe extends Component {
  constructor(props) {
    super(props);
    this.state = { isStatic: true };
  }

  render() {
    const {
      className,
      rootClassName,
      geolocation,
      publicData,
      options,
      selectedOptions,
      listingId,
      ...rest
    } = this.props;

    if (!selectedOptions) {
      return null;
    }

    const classes = classNames(rootClassName || css.sectionMap, className);
    const getMap = () => {
      if (selectedOptions.includes(ONSITE)) {
        const address = publicData && publicData.location ? publicData.location.address : '';
        const cacheKey = listingId
          ? `${listingId.uuid}_${geolocation.lat}_${geolocation.lng}`
          : null;

        const mapProps = config.maps.fuzzy.enabled
          ? { obfuscatedCenter: obfuscatedCoordinates(geolocation, cacheKey) }
          : { address, center: geolocation };
        return <Map {...mapProps} useStaticMap={this.state.isStatic} />;
      }
      return null;
    };
    const map = getMap();

    return (
      <div className={classes}>
        <h2 className={css.locationTitle}>
          <FormattedMessage id="ListingPage.locationTitle" />
        </h2>
        <PropertyGroup
          id="ProgramListingPage.teachingForm"
          options={options}
          selectedOptions={selectedOptions}
          {...rest}
        />
        {selectedOptions.includes(ONSITE) &&
          (this.state.isStatic ? (
            <button
              className={css.map}
              onClick={() => {
                this.setState({ isStatic: false });
              }}
            >
              {map}
            </button>
          ) : (
            <div className={css.map}>{map}</div>
          ))}
      </div>
    );
  }
}

SectionTeachingLocationMaybe.defaultProps = {
  rootClassName: null,
  className: null,
  geolocation: null,
  listingId: null,
};

SectionTeachingLocationMaybe.propTypes = {
  rootClassName: string,
  className: string,
  geolocation: propTypes.latlng,
  listingId: propTypes.uuid,
  options: array,
  selectedOptions: array,
};

export default SectionTeachingLocationMaybe;
