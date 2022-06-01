import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form as FinalForm, Field } from 'react-final-form';
import { intlShape, injectIntl } from '../../util/reactIntl';
import { Form, LocationAutocompleteInput } from '..';

import css from './TeachingLocationSearchForm.module.css';

const identity = v => v;

class TeachingLocationSearchFormComponent extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.searchInput = null;
  }

  onChange(location) {
    if (location.selectedPlace) {
      // Note that we use `onSubmit` instead of the conventional
      // `handleSubmit` prop for submitting. We want to autosubmit
      // when a place is selected, and don't require any extra
      // validations for the form.
      this.props.onSubmit({ location });
      // blur search input to hide software keyboard
      if (this.searchInput) {
        this.searchInput.blur();
      }
    }
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        render={formRenderProps => {
          const { desktopInputRoot, intl, isMobile } = formRenderProps;
          const desktopInputRootClass = desktopInputRoot || css.desktopInputRoot;
          return (
            <Field
              name="teachingLocation"
              format={identity}
              render={({ input, meta }) => {
                const { onChange, ...restInput } = input;

                const searchOnChange = value => {
                  onChange(value);
                  this.onChange(value);
                };

                const searchInput = { ...restInput, onChange: searchOnChange };
                return (
                  <LocationAutocompleteInput
                    className={isMobile ? css.mobileInputRoot : desktopInputRootClass}
                    iconClassName={isMobile ? css.mobileIcon : css.desktopIcon}
                    inputClassName={isMobile ? css.mobileInput : css.desktopInput}
                    predictionsClassName={isMobile ? css.mobilePredictions : css.desktopPredictions}
                    predictionsAttributionClassName={
                      isMobile ? css.mobilePredictionsAttribution : null
                    }
                    placeholder={intl.formatMessage({
                      id: 'TeachingLocationSearchForm.placeholder',
                    })}
                    closeOnBlur={!isMobile}
                    inputRef={node => {
                      this.searchInput = node;
                    }}
                    input={searchInput}
                    meta={meta}
                  />
                );
              }}
            />
          );
        }}
      />
    );
  }
}

const { func, string, bool } = PropTypes;

TeachingLocationSearchFormComponent.defaultProps = {
  rootClassName: '',
  className: '',
  desktopInputRoot: '',
  isMobile: false,
};

TeachingLocationSearchFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  desktopInputRoot: string,
  onSubmit: func.isRequired,
  isMobile: bool,

  // from injectIntl
  intl: intlShape.isRequired,
};

const TeachingLocationSearchForm = injectIntl(TeachingLocationSearchFormComponent);

export default TeachingLocationSearchForm;
