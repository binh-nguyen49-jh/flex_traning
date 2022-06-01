import React, { Component } from 'react';
import { array, arrayOf, func, node, number, object, shape, string } from 'prop-types';
import classNames from 'classnames';
import { injectIntl, intlShape } from '../../util/reactIntl';
import { parseSelectFilterOptions } from '../../util/search';
import { FieldCheckbox } from '..';

import { FilterPopup, FilterPlain } from '..';
import css from './TeachingLocationFilter.module.css';
import { ONSITE } from '../../marketplace-custom-config';
import { LocationAutocompleteInputField } from '../LocationAutocompleteInput/LocationAutocompleteInput';
import routeConfiguration from '../../routeConfiguration';
import { createResourceLocatorString } from '../../util/routes';
import { withRouter } from 'react-router-dom';
import config from '../../config';
import TeachingLocationSearchForm from './TeachingLocationSearchForm';
import { parse } from '../../util/urlHelpers';

// TeachingLocationFilter doesn't need array mutators since it doesn't require validation.
// TODO: Live edit didn't work with FieldCheckboxGroup
//       There's a mutation problem: formstate.dirty is not reliable with it.
const GroupOfFieldCheckboxes = props => {
  const { id, className, name, options, handleClick } = props;
  return (
    <fieldset className={className}>
      <ul className={css.list}>
        {options.map((option, index) => {
          const fieldId = `${id}.${option.key}`;
          return (
            <li key={fieldId} className={css.item}>
              <FieldCheckbox
                onClick={handleClick}
                id={fieldId}
                name={name}
                label={option.label}
                value={option.key}
              />
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
};

const getQueryParamName = queryParamNames => {
  return Array.isArray(queryParamNames) ? queryParamNames[0] : queryParamNames;
};

// Format URI component's query param: { pub_key: 'has_all:a,b,c' }
const format = (selectedOptions, queryParamName, searchMode) => {
  const hasOptionsSelected = selectedOptions && selectedOptions.length > 0;
  const mode = searchMode ? `${searchMode}:` : '';
  const value = hasOptionsSelected ? `${mode}${selectedOptions.join(',')}` : null;
  return { [queryParamName]: value };
};

class TeachingLocationFilter extends Component {
  constructor(props) {
    super(props);

    this.filter = null;
    this.filterContent = null;
    this.state = {
      isChoosingOnSite: false,
    };

    this.positionStyleForContent = this.positionStyleForContent.bind(this);
  }

  handleClickOption = event => {
    const chosenOption = event.target.value;
    const isChoosingOnSite = chosenOption === ONSITE;
    if (isChoosingOnSite) {
      this.setState({ isChoosingOnSite: !this.state.isChoosingOnSite });
      return;
    }
  };

  positionStyleForContent() {
    if (this.filter && this.filterContent) {
      // Render the filter content to the right from the menu
      // unless there's no space in which case it is rendered
      // to the left
      const distanceToRight = window.innerWidth - this.filter.getBoundingClientRect().right;
      const labelWidth = this.filter.offsetWidth;
      const contentWidth = this.filterContent.offsetWidth;
      const contentWidthBiggerThanLabel = contentWidth - labelWidth;
      const renderToRight = distanceToRight > contentWidthBiggerThanLabel;
      const contentPlacementOffset = this.props.contentPlacementOffset;

      const offset = renderToRight
        ? { left: contentPlacementOffset }
        : { right: contentPlacementOffset };
      // set a min-width if the content is narrower than the label
      const minWidth = contentWidth < labelWidth ? { minWidth: labelWidth } : null;

      return { ...offset, ...minWidth };
    }
    return {};
  }

  componentDidMount() {
    const { queryParamNames, initialValues } = this.props;
    const queryParamName = getQueryParamName(queryParamNames);
    const initialValue = initialValues[queryParamName];
    const isChoosingOnSite = initialValue && initialValue.includes();
    this.setState({ isChoosingOnSite });
  }

  handleSubmitLocation = values => {
    const { urlQueryParams } = this.props;
    const { search, selectedPlace } = values.location;
    const { history } = this.props;
    const { origin, bounds } = selectedPlace;
    const originMaybe = config.sortSearchByDistance ? { origin } : {};
    const searchParams = {
      ...urlQueryParams,
      ...originMaybe,
      address: search,
      bounds,
    };
    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, searchParams));
  };
  handleClear = () => {
    this.setState({ isChoosingOnSite: false });
  };

  render() {
    const {
      rootClassName,
      className,
      id,
      name,
      label,
      options,
      initialValues,
      contentPlacementOffset,
      onSubmit,
      queryParamNames,
      searchMode,
      intl,
      showAsPopup,
      ...rest
    } = this.props;

    const { isChoosingOnSite } = this.state;

    const classes = classNames(rootClassName || css.root, className);

    const queryParamName = getQueryParamName(queryParamNames);
    const hasInitialValues = !!initialValues && !!initialValues[queryParamName];
    // Parse options from param strings like "has_all:a,b,c" or "a,b,c"
    const selectedOptions = hasInitialValues
      ? parseSelectFilterOptions(initialValues[queryParamName])
      : [];

    const labelForPopup = hasInitialValues
      ? intl.formatMessage(
          { id: 'TeachingLocationFilter.labelSelected' },
          { labelText: label, count: selectedOptions.length }
        )
      : label;

    const labelForPlain = hasInitialValues
      ? intl.formatMessage(
          { id: 'TeachingLocationFilterPlainForm.labelSelected' },
          { labelText: label, count: selectedOptions.length }
        )
      : label;

    const contentStyle = this.positionStyleForContent();

    // pass the initial values with the name key so that
    // they can be passed to the correct field
    const namedInitialValues = { [name]: selectedOptions };

    const handleSubmit = values => {
      const usedValue = values ? values[name] : values;
      onSubmit(format(usedValue, queryParamName, searchMode));
    };

    const { address, origin, bounds } = parse(location.search, {
      latlng: ['origin'],
      latlngBounds: ['bounds'],
    });
    // Only render current search if full place object is available in the URL params
    const locationFieldsPresent = config.sortSearchByDistance
      ? address && origin && bounds
      : address && bounds;
    const initialSearchFormValues = {
      teachingLocation: locationFieldsPresent
        ? {
            search: address,
            selectedPlace: { address, origin, bounds },
          }
        : null,
    };

    return showAsPopup ? (
      <FilterPopup
        className={classes}
        rootClassName={rootClassName}
        popupClassName={css.popupSize}
        name={name}
        label={labelForPopup}
        isSelected={hasInitialValues}
        id={`${id}.popup`}
        showAsPopup
        contentPlacementOffset={contentPlacementOffset}
        onSubmit={handleSubmit}
        initialValues={namedInitialValues}
        keepDirtyOnReinitialize
        onClear={this.handleClear}
        {...rest}
      >
        <GroupOfFieldCheckboxes
          className={css.fieldGroup}
          name={name}
          id={`${id}-checkbox-group`}
          options={options}
          handleClick={this.handleClickOption}
        />
        {isChoosingOnSite && <LocationAutocompleteInputField />}
      </FilterPopup>
    ) : (
      <FilterPlain
        className={className}
        rootClassName={rootClassName}
        label={labelForPlain}
        isSelected={hasInitialValues}
        id={`${id}.plain`}
        liveEdit
        contentPlacementOffset={contentStyle}
        onSubmit={handleSubmit}
        initialValues={namedInitialValues}
        onClear={this.handleClear}
        {...rest}
      >
        <GroupOfFieldCheckboxes
          className={css.fieldGroupPlain}
          name={name}
          id={`${id}-checkbox-group`}
          options={options}
          handleClick={this.handleClickOption}
        />
        {isChoosingOnSite && (
          <TeachingLocationSearchForm
            onSubmit={this.handleSubmitLocation}
            initialValues={initialSearchFormValues}
          />
        )}
      </FilterPlain>
    );
  }
}

TeachingLocationFilter.defaultProps = {
  rootClassName: null,
  className: null,
  initialValues: null,
  contentPlacementOffset: 0,
};

TeachingLocationFilter.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  name: string.isRequired,
  queryParamNames: arrayOf(string).isRequired,
  label: node.isRequired,
  onSubmit: func.isRequired,
  options: array.isRequired,
  initialValues: object,
  contentPlacementOffset: number,

  // form injectIntl
  intl: intlShape.isRequired,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({ state: object }).isRequired,
};

export default withRouter(injectIntl(TeachingLocationFilter));
