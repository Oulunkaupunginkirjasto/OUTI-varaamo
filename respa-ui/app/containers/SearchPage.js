import isEqual from 'lodash/isEqual';
import React, { Component, PropTypes } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import DocumentTitle from 'react-document-title';
import { findDOMNode } from 'react-dom';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { searchResources } from 'actions/searchActions';
import { fetchUnits } from 'actions/unitActions';
import SearchResults from 'components/search/SearchResults';
import RightSearchControls from 'containers/RightSearchControls';
import SearchControls from 'containers/SearchControls';
import TopSearchControls from 'containers/TopSearchControls';
import searchPageSelector from 'selectors/containers/searchPageSelector';
import { scrollTo } from 'utils/DOMUtils';
import { getFetchParamsFromFilters } from 'utils/SearchUtils';

const messages = defineMessages({
  title: {
    id: 'search.title',
    defaultMessage: 'Haku - Varaamo',
  },
});

export class UnconnectedSearchPage extends Component {
  constructor(props) {
    super(props);
    this.handleCalendarViewDateChange = this.handleCalendarViewDateChange.bind(this);
    this.scrollToSearchResults = this.scrollToSearchResults.bind(this);
  }

  componentDidMount() {
    const { actions, filters, searchDone } = this.props;
    const fetchParams = getFetchParamsFromFilters(filters);
    if (searchDone || fetchParams.purpose || fetchParams.people
      || fetchParams.search || fetchParams.unit) {
      actions.searchResources(fetchParams);
    }
    actions.fetchUnits();
  }

  componentWillUpdate(nextProps) {
    const { filters, searchDone } = nextProps;
    if (isEqual(nextProps.filters, this.props.filters)) {
      return;
    }
    const fetchParams = getFetchParamsFromFilters(filters);
    if (searchDone || fetchParams.purpose || fetchParams.people
      || fetchParams.search || fetchParams.unit) {
      this.props.actions.searchResources(fetchParams);
    }
  }

  handleCalendarViewDateChange(dateText) {
    const { actions, filters, searchDone } = this.props;
    const newFilters = Object.assign({}, filters, { date: dateText });
    const fetchParams = getFetchParamsFromFilters(newFilters, filters.date);

    if (searchDone || fetchParams.purpose || fetchParams.people
      || fetchParams.search || fetchParams.unit) {
      actions.searchResources(fetchParams);
    }
  }

  scrollToSearchResults() {
    scrollTo(findDOMNode(this.refs.searchResults));
  }

  render() {
    const {
      filters,
      intl,
      isFetchingSearchResults,
      location,
      params,
      results,
      searchDone,
      units,
    } = this.props;

    return (
      <DocumentTitle title={intl.formatMessage(messages.title)}>
        <div className="search-page">
          <h1><FormattedMessage
            id="search.page_header"
            defaultMessage="Haku"
          /></h1>
          <TopSearchControls
            location={location}
            onCalendarViewDateChange={this.handleCalendarViewDateChange}
            params={params}
            scrollToSearchResults={this.scrollToSearchResults}
          />
          <Grid fluid>
            <Row>
              <Col xs={12} md={5} lg={4}>
                <SearchControls
                  location={location}
                  onCalendarViewDateChange={this.handleCalendarViewDateChange}
                  params={params}
                  scrollToSearchResults={this.scrollToSearchResults}
                />
              </Col>
              <Col xs={12} md={7} lg={8}>
                <RightSearchControls
                  location={location}
                  onCalendarViewDateChange={this.handleCalendarViewDateChange}
                  params={params}
                  scrollToSearchResults={this.scrollToSearchResults}
                />
                {searchDone || isFetchingSearchResults ? (
                  <SearchResults
                    date={filters.date}
                    filters={filters}
                    isFetching={isFetchingSearchResults}
                    ref="searchResults"
                    results={results}
                    searchDone={searchDone}
                    units={units}
                  />
                ) : (
                  <p className="help-text">
                    <FormattedMessage
                      id="search.help_text"
                      defaultMessage="Etsi tilaa syöttämällä hakukenttään tilaan liittyvää tietoa."
                    />
                  </p>
                )}
              </Col>
            </Row>
          </Grid>
        </div>
      </DocumentTitle>
    );
  }
}

UnconnectedSearchPage.propTypes = {
  actions: PropTypes.object.isRequired,
  isFetchingSearchResults: PropTypes.bool.isRequired,
  filters: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  results: PropTypes.array.isRequired,
  searchDone: PropTypes.bool.isRequired,
  units: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    searchResources,
    fetchUnits,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default injectIntl(connect(searchPageSelector, mapDispatchToProps)(UnconnectedSearchPage));
