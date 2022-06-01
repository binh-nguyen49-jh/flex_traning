import React, { Component } from 'react';
import { arrayOf, func, node, number, shape, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import config from '../../config';

import HoursFilterForm from '../../forms/HoursFilterForm/HoursFilterForm';

import css from './HoursFilterPlain.module.css';

const RADIX = 10;

const getHoursQueryParamName = queryParamNames => {
  return Array.isArray(queryParamNames)
    ? queryParamNames[0]
    : typeof queryParamNames === 'string'
    ? queryParamNames
    : 'hours';
};

// Parse value, which should look like "0,1000"
const parse = hoursRange => {
  const [minHours, maxHours] = !!hoursRange
    ? hoursRange.split(',').map(v => Number.parseInt(v, RADIX))
    : [];
  // Note: we compare to null, because 0 as minHours is falsy in comparisons.
  return !!hoursRange && minHours != null && maxHours != null ? { minHours, maxHours } : null;
};

// Format value, which should look like { minHours, maxHours }
const format = (range, queryParamName) => {
  const { minHours, maxHours } = range || {};
  // Note: we compare to null, because 0 as minHours is falsy in comparisons.
  const value = minHours != null && maxHours != null ? `${minHours},${maxHours}` : null;
  return { [queryParamName]: value };
};

class HoursFilterPlainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: true };

    this.handleChange = this.handleChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
  }

  handleChange(values) {
    const { onSubmit, queryParamNames } = this.props;
    const hoursQueryParamName = getHoursQueryParamName(queryParamNames);
    onSubmit(format(values, hoursQueryParamName));
  }

  handleClear() {
    const { onSubmit, queryParamNames } = this.props;
    const hoursQueryParamName = getHoursQueryParamName(queryParamNames);
    onSubmit(format(null, hoursQueryParamName));
  }

  toggleIsOpen() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  render() {
    const {
      rootClassName,
      className,
      id,
      label,
      queryParamNames,
      initialValues,
      min,
      max,
      step,
      intl,
    } = this.props;
    const classes = classNames(rootClassName || css.root, className);

    const hoursQueryParam = getHoursQueryParamName(queryParamNames);
    const initialHours = initialValues ? parse(initialValues[hoursQueryParam]) : {};
    const { minHours, maxHours } = initialHours || {};

    const hasValue = value => value != null;
    const hasInitialValues = initialValues && hasValue(minHours) && hasValue(maxHours);

    const labelClass = hasInitialValues ? css.filterLabelSelected : css.filterLabel;
    const labelText = hasInitialValues
      ? intl.formatMessage(
          { id: 'HoursFilter.labelSelectedPlain' },
          {
            minHours: minHours,
            maxHours: maxHours,
          }
        )
      : label
      ? label
      : intl.formatMessage({ id: 'HoursFilter.label' });

    return (
      <div className={classes}>
        <div className={labelClass}>
          <button type="button" className={css.labelButton} onClick={this.toggleIsOpen}>
            <span className={labelClass}>{labelText}</span>
          </button>
          <button type="button" className={css.clearButton} onClick={this.handleClear}>
            <FormattedMessage id={'HoursFilter.clear'} />
          </button>
        </div>
        <div className={css.formWrapper}>
          <HoursFilterForm
            id={id}
            initialValues={hasInitialValues ? initialHours : { minHours: min, maxHours: max }}
            onChange={this.handleChange}
            intl={intl}
            contentRef={node => {
              this.filterContent = node;
            }}
            min={min}
            max={max}
            step={step}
            liveEdit
            isOpen={this.state.isOpen}
          />
        </div>
      </div>
    );
  }
}

HoursFilterPlainComponent.defaultProps = {
  rootClassName: null,
  className: null,
  initialValues: null,
  step: number,
  currencyConfig: config.currencyConfig,
};

HoursFilterPlainComponent.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  label: node,
  queryParamNames: arrayOf(string).isRequired,
  onSubmit: func.isRequired,
  initialValues: shape({
    hours: string,
  }),
  min: number.isRequired,
  max: number.isRequired,
  step: number,
  currencyConfig: propTypes.currencyConfig,

  // form injectIntl
  intl: intlShape.isRequired,
};

const PriceFilterPlain = injectIntl(HoursFilterPlainComponent);

export default PriceFilterPlain;
