import includes from 'lodash/includes';
import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Loader from 'react-loader';
import { connect } from 'react-redux';

import ReservationsListItem from 'components/reservation/ReservationsListItem';
import reservationsListSelector from 'selectors/containers/reservationsListSelector';

export class UnconnectedReservationsList extends Component {
  constructor(props) {
    super(props);
    this.renderReservationsListItem = this.renderReservationsListItem.bind(this);
  }

  renderReservationsListItem(reservation) {
    const {
      isAdmin,
      resources,
      staffUnits,
      units,
    } = this.props;
    const resource = resources[reservation.resource] || {};
    const unit = resource.unit ? units[resource.unit] || {} : {};

    return (
      <ReservationsListItem
        isAdmin={isAdmin}
        isStaff={includes(staffUnits, resource.unit)}
        key={reservation.url}
        reservation={reservation}
        resource={resource}
        unit={unit}
      />
    );
  }

  render() {
    const {
      emptyMessage,
      loading,
      reservations,
    } = this.props;

    return (
      <Loader loaded={!loading}>
        {reservations.length ? (
          <div>
            <ul className="reservations-list">
              {reservations.map(this.renderReservationsListItem)}
            </ul>
          </div>
        ) : (
          <p>{emptyMessage ||
            <FormattedMessage
              id="reservation_list.no_reservations"
              defaultMessage="Sinulla ei vielä ole yhtään varausta."
            />}
          </p>
        )}
      </Loader>
    );
  }
}

UnconnectedReservationsList.propTypes = {
  emptyMessage: PropTypes.string,
  filter: PropTypes.string,
  isAdmin: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  reservations: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  staffUnits: PropTypes.array.isRequired,
  units: PropTypes.object.isRequired,
};

export default connect(reservationsListSelector)(UnconnectedReservationsList);
