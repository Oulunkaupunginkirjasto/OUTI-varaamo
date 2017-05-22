import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchReservations } from 'actions/reservationActions';
import { fetchResources } from 'actions/resourceActions';
import { changeAdminReservationsFilters } from 'actions/uiActions';
import { fetchUnits } from 'actions/unitActions';
import AdminReservationsFilters from 'components/reservation/AdminReservationsFilters';
import ReservationCancelModal from 'containers/ReservationCancelModal';
import ReservationInfoModal from 'containers/ReservationInfoModal';
import ReservationsList from 'containers/ReservationsList';
import userReservationsPageSelector from 'selectors/containers/userReservationsPageSelector';

const messages = defineMessages({
  noOrdinary: {
    id: 'myreservations.no_ordinary',
    defaultMessage: 'Ei tavallisia varauksia näytettäväksi.',
  },
  noPreliminary: {
    id: 'myreservations.no_preliminary',
    defaultMessage: 'Ei alustavia varauksia näytettäväksi.',
  },
  title: {
    id: 'myreservations.title',
    defaultMessage: 'Omat varaukset - Varaamo',
  },
});

export class UnconnectedUserReservationsPage extends Component {
  constructor(props) {
    super(props);
    this.handleFiltersChange = this.handleFiltersChange.bind(this);
  }

  componentDidMount() {
    this.adminReservationsLoaded = false;
    if (this.props.isAdmin) {
      this.props.actions.fetchReservations({ canApprove: true });
      this.adminReservationsLoaded = true;
    }
    this.props.actions.fetchResources({ pageSize: 1000 });
    this.props.actions.fetchUnits();
    this.props.actions.fetchReservations({ isOwn: true });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.adminReservationsLoaded && nextProps.isAdmin) {
      this.props.actions.fetchReservations({ canApprove: true });
      this.adminReservationsLoaded = true;
    }
  }

  handleFiltersChange(filters) {
    this.props.actions.changeAdminReservationsFilters(filters);
    if (filters.state === 'all') {
      this.props.actions.fetchReservations({ canApprove: true });
    } else {
      this.props.actions.fetchReservations({ canApprove: true, state: filters.state });
    }
  }

  render() {
    const {
      adminReservationsFilters,
      intl,
      isAdmin,
      reservationsFetchCount,
      resourcesLoaded,
    } = this.props;

    return (
      <DocumentTitle title={intl.formatMessage(messages.title)}>
        <Loader loaded={resourcesLoaded}>
          <div>
            { !isAdmin && (
              <div>
                <h1><FormattedMessage
                  id="myreservations.page_header"
                  defaultMessage="Omat varaukset"
                /></h1>
                <ReservationsList
                  loading={reservationsFetchCount < 1}
                />
              </div>
            )}
            { isAdmin && (
              <div>
                <h1>Alustavat varaukset</h1>
                <AdminReservationsFilters
                  filters={adminReservationsFilters}
                  onFiltersChange={this.handleFiltersChange}
                />
                <ReservationsList
                  emptyMessage="Ei alustavia varauksia näytettäväksi."
                  filter={adminReservationsFilters.state}
                  loading={reservationsFetchCount < 2}
                />
                <h1>Tavalliset varaukset</h1>
                <ReservationsList
                  emptyMessage="Ei tavallisia varauksia näytettäväksi."
                  filter="regular"
                  loading={reservationsFetchCount < 1}
                />
              </div>
            )}
            <ReservationCancelModal />
            <ReservationInfoModal />
          </div>
        </Loader>
      </DocumentTitle>
    );
  }
}

UnconnectedUserReservationsPage.propTypes = {
  actions: PropTypes.object.isRequired,
  adminReservationsFilters: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  reservationsFetchCount: PropTypes.number.isRequired,
  resourcesLoaded: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    changeAdminReservationsFilters,
    fetchReservations,
    fetchResources,
    fetchUnits,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default injectIntl(
  connect(userReservationsPageSelector, mapDispatchToProps)(UnconnectedUserReservationsPage)
);
