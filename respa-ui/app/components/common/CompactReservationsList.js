import React, { Component, PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';

import TimeRange from 'components/common/TimeRange';
import { getName } from 'utils/DataUtils';

class CompactReservationsList extends Component {
  constructor(props) {
    super(props);
    this.renderReservation = this.renderReservation.bind(this);
  }

  renderReservation(reservation) {
    const { intl } = this.props;
    if (!this.props.resources) {
      return (
        <li key={reservation.begin}>
          <TimeRange begin={reservation.begin} end={reservation.end} />
        </li>
      );
    }
    const resource = this.props.resources[reservation.resource] || {};
    return (
      <li key={reservation.begin}>
        {getName(resource, intl.locale)}
        {': '}
        <TimeRange begin={reservation.begin} end={reservation.end} />
      </li>
    );
  }

  render() {
    return (
      <ul>
        {this.props.reservations.map(this.renderReservation)}
      </ul>
    );
  }
}

CompactReservationsList.propTypes = {
  intl: intlShape.isRequired,
  reservations: PropTypes.array.isRequired,
  resources: PropTypes.object,
};

export default injectIntl(CompactReservationsList);
