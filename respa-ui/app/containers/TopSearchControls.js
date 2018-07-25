import throttle from 'lodash/throttle';
import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { findDOMNode } from 'react-dom';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePath } from 'redux-simple-router';

import { fetchPurposes } from 'actions/purposeActions';
import { getTypeaheadSuggestions } from 'actions/searchActions';
import { changeSearchFilters } from 'actions/uiActions';
import { fetchUnits } from 'actions/unitActions';
import SearchFilters from 'components/search/SearchFilters';
import searchControlsSelector from 'selectors/containers/searchControlsSelector';
import { scrollTo } from 'utils/DOMUtils';

export class UnconnectedSearchControls extends Component {
  constructor(props) {
    super(props);
    this.fetchTypeaheadSuggestions = this.fetchTypeaheadSuggestions.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onFiltersChange = this.onFiltersChange.bind(this);
  }

  componentDidMount() {
    const { actions, urlSearchFilters } = this.props;
    if (urlSearchFilters.purpose) {
      scrollTo(findDOMNode(this.refs.searchFilters));
    }
    actions.changeSearchFilters(urlSearchFilters);
    actions.fetchPurposes();
    this.fetchTypeaheadSuggestions = throttle(
      this.fetchTypeaheadSuggestions, 200, { leading: false, trailing: true }
    );
    this.throttledHandleSearch = throttle(
      this.handleSearch, 1000, { leading: false, trailing: true }
    );
  }

  onDateChange(newDate) {
    this.onFiltersChange({ date: newDate });
    this.handleSearch({ date: newDate }, { preventScrolling: true });
  }

  onFiltersChange(newFilters) {
    this.props.actions.changeSearchFilters(newFilters);
    this.handleSearch(newFilters, { preventScrolling: true });
  }

  fetchTypeaheadSuggestions(value) {
    this.props.actions.getTypeaheadSuggestions({ full: true, input: value });
  }

  handleSearch(newFilters, options = {}) {
    const { actions, scrollToSearchResults } = this.props;
    let filters;
    if (newFilters) {
      filters = Object.assign({}, this.props.filters, newFilters);
    } else {
      filters = this.props.filters;
    }

    actions.updatePath(`/search?${queryString.stringify(filters)}`);
    if (!options.preventScrolling) {
      scrollToSearchResults();
    }
  }

  handleSearchInputChange(value) {
    this.props.actions.changeSearchFilters({ search: value });
    this.fetchTypeaheadSuggestions(value);
    if (value.length > 2) {
      this.throttledHandleSearch({ search: value }, { preventScrolling: true });
    }
  }

  render() {
    const {
      isFetchingPurposes,
      isFetchingUnits,
      purposeOptions,
      unitOptions,
    } = this.props;

    return (
      <div>
        <SearchFilters
          isFetchingPurposes={isFetchingPurposes}
          isFetchingUnits={isFetchingUnits}
          onFiltersChange={this.onFiltersChange}
          purposeOptions={purposeOptions}
          unitOptions={unitOptions}
          filters={this.props.filters}
          ref="searchFilters"
        />
        <Button
          block
          bsStyle="primary"
          className="search-button"
          onClick={() => this.handleSearch()}
          type="submit"
        >
          <FormattedMessage
            id="search_controls.search"
            defaultMessage="Hae"
          />
        </Button>
      </div>
    );
  }
}

UnconnectedSearchControls.propTypes = {
  actions: PropTypes.object.isRequired,
  calendarAvailability: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  fetchDates: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  isFetchingPurposes: PropTypes.bool.isRequired,
  isFetchingUnits: PropTypes.bool.isRequired,
  onCalendarViewDateChange: PropTypes.func.isRequired,
  purposeOptions: PropTypes.array.isRequired,
  scrollToSearchResults: PropTypes.func.isRequired,
  typeaheadOptions: PropTypes.array.isRequired,
  unitOptions: PropTypes.array.isRequired,
  urlSearchFilters: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    changeSearchFilters,
    fetchPurposes,
    fetchUnits,
    getTypeaheadSuggestions,
    updatePath,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default injectIntl(
  connect(searchControlsSelector, mapDispatchToProps)(UnconnectedSearchControls)
);
