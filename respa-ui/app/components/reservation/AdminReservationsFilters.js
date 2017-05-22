import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import React, { Component, PropTypes } from 'react';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Select from 'react-select';

import constants from 'constants/AppConstants';

const messages = defineMessages({
  all: {
    id: 'reservation.all',
    defaultMessage: 'Kaikki',
  },
});

class AdminReservationsFilters extends Component {
  render() {
    const {
      onFiltersChange,
      filters,
      intl,
    } = this.props;

    let stateOptions = map(
      constants.RESERVATION_STATE_LABELS,
      (value, key) => ({
        label: value.labelText[intl.locale],
        value: key,
      })
    );
    stateOptions = sortBy(stateOptions, 'label');
    stateOptions.unshift({ label: intl.formatMessage(messages.all), value: 'all' });

    return (
      <div className="reservations-filters">
        <h4><FormattedMessage
          id="reservation.reservation_status"
          defaultMessage="Varauksen status"
        /></h4>
        <Select
          className="reservation-state-select"
          clearable={false}
          name="reservation-state-select"
          onChange={(value) => onFiltersChange({ state: value })}
          options={stateOptions}
          value={filters.state}
        />
      </div>
    );
  }
}

AdminReservationsFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
};

export default injectIntl(AdminReservationsFilters);
