import isEmpty from 'lodash/isEmpty';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import DocumentTitle from 'react-document-title';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { bindActionCreators } from 'redux';

import { fetchResource } from 'actions/resourceActions';
import ResourceHeader from 'components/resource/ResourceHeader';
import ReservationInfo from 'components/reservation/ReservationInfo';
import NotFoundPage from 'containers/NotFoundPage';
import ReservationCalendar from 'containers/ReservationCalendar';
import ReservationDateSelect from 'containers/ReservationDateSelect';
import reservationPageSelector from 'selectors/containers/reservationPageSelector';
import { getAddressWithName, getName } from 'utils/DataUtils';
import { getStartAndEndTimes } from 'utils/TimeUtils';

const messages = defineMessages({
  title: {
    id: 'reservation_page.title',
    defaultMessage: '{resourceName} - varauskalenteri - Varaamo',
  },
});

export class UnconnectedReservationPage extends Component {
  constructor(props) {
    super(props);
    this.handleCalendarViewDateChange = this.handleCalendarViewDateChange.bind(this);
  }

  componentDidMount() {
    const { actions, date, id } = this.props;
    const fetchParams = getStartAndEndTimes(date);

    actions.fetchResource(id, fetchParams);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.date !== this.props.date) {
      const { actions, id } = this.props;
      const fetchParams = getStartAndEndTimes(nextProps.date);

      actions.fetchResource(id, fetchParams);
    }
  }

  handleCalendarViewDateChange(dateText) {
    const { actions, date, id } = this.props;
    const fetchParams = getStartAndEndTimes(dateText, date);

    actions.fetchResource(id, fetchParams);
  }

  render() {
    const {
      date,
      id,
      intl,
      isFetchingResource,
      isLoggedIn,
      location,
      params,
      resource,
      unit,
    } = this.props;
    const resourceName = getName(resource, intl.locale);

    if (isEmpty(resource) && !isFetchingResource) {
      return <NotFoundPage />;
    }

    return (
      <DocumentTitle title={intl.formatMessage(messages.title, { resourceName })}>
        <Loader loaded={!isEmpty(resource)}>
          <div className="reservation-page">
            <ResourceHeader
              address={getAddressWithName(unit, intl.locale)}
              name={resourceName}
            />
            <LinkContainer to={`/resources/${id}?date=${date.split('T')[0]}`}>
              <Button
                bsSize="large"
                bsStyle="primary"
                className="responsive-button"
              >
                <FormattedMessage
                  id="reservation_page.resource_info"
                  defaultMessage="Lisätiedot"
                />
              </Button>
            </LinkContainer>
            <ReservationInfo
              isLoggedIn={isLoggedIn}
              resource={resource}
            />
            <h2 id="reservation-header">
              {isLoggedIn ?
                <FormattedMessage
                  id="reservation_page.reserve_title"
                  defaultMessage="Tee varaus"
                /> :
                <FormattedMessage
                  id="reservation_page.reservation_status_title"
                  defaultMessage="Varaustilanne"
                />}
            </h2>
            <Grid fluid>
              <Row>
                <Col xs={12} md={5} lg={4}>
                  <ReservationDateSelect
                    location={location}
                    params={params}
                    onCalendarViewDateChange={this.handleCalendarViewDateChange}
                  />
                </Col>
                <Col xs={12} md={7} lg={8}>
                  <ReservationCalendar
                    location={location}
                    params={params}
                    onCalendarViewDateChange={this.handleCalendarViewDateChange}
                  />
                </Col>
              </Row>
            </Grid>
          </div>
        </Loader>
      </DocumentTitle>
    );
  }
}

UnconnectedReservationPage.propTypes = {
  actions: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  isFetchingResource: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    fetchResource,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default injectIntl(
  connect(reservationPageSelector, mapDispatchToProps)(UnconnectedReservationPage)
);
