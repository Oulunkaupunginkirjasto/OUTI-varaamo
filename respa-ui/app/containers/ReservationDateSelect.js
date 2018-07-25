import React, { Component, PropTypes } from 'react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePath } from 'redux-simple-router';

import { postLogin } from 'actions/authActions';
import { addNotification } from 'actions/notificationsActions';
import {
  deleteReservation,
  postReservation,
  putReservation,
} from 'actions/reservationActions';
import {
  cancelReservationEdit,
  changeMultiDayReservationRange,
  clearReservations,
  closeConfirmReservationModal,
  openConfirmReservationModal,
  openLoginModal,
  toggleTimeSlot,
} from 'actions/uiActions';
import AvailableDatePicker from 'components/common/AvailableDatePicker';
import reservationCalendarSelector from 'selectors/containers/reservationCalendarSelector';

const messages = defineMessages({
  gotoSelected: {
    id: 'reservation_calendar.go_to_selected',
    defaultMessage: 'Mene valittuun',
  },
  today: {
    id: 'reservation_calendar.today',
    defaultMessage: 'Tänään',
  },
});

export class UnconnectedReservationCalendar extends Component {
  constructor(props) {
    super(props);
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(newDate) {
    const { actions, id } = this.props;
    actions.updatePath(`/resources/${id}/reservation?date=${newDate}`);
  }

  render() {
    const {
      calendarAvailability,
      date,
      fetchDates,
      intl,
      onCalendarViewDateChange,
    } = this.props;

    return (
      <div>
        <AvailableDatePicker
          availability={calendarAvailability}
          fetchDates={fetchDates}
          date={date}
          hideFooter
          gotoSelectedText={intl.formatMessage(messages.gotoSelected)}
          locale={intl.locale}
          onChange={this.onDateChange}
          onViewDateChange={onCalendarViewDateChange}
          style={{ height: 210 }}
          todayText={intl.formatMessage(messages.today)}
        />
      </div>
    );
  }
}

UnconnectedReservationCalendar.propTypes = {
  actions: PropTypes.object.isRequired,
  calendarAvailability: PropTypes.object.isRequired,
  confirmReservationModalIsOpen: PropTypes.bool.isRequired,
  date: PropTypes.string.isRequired,
  fetchDates: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  isFetchingResource: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isLoggingIn: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  multiDay: PropTypes.object.isRequired,
  onCalendarViewDateChange: PropTypes.func,
  passwordRequired: PropTypes.bool.isRequired,
  reservationsToEdit: PropTypes.array.isRequired,
  resource: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  selectedReservations: PropTypes.array.isRequired,
  time: PropTypes.string,
  timeSlots: PropTypes.array.isRequired,
  staffUnits: PropTypes.array.isRequired,
  urlHash: PropTypes.string.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    addNotification,
    cancelReservationEdit,
    changeMultiDayReservationRange,
    clearReservations,
    closeConfirmReservationModal,
    deleteReservation,
    openConfirmReservationModal,
    openLoginModal,
    postLogin,
    postReservation,
    updatePath,
    putReservation,
    toggleTimeSlot,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default (
  injectIntl(
    connect(reservationCalendarSelector, mapDispatchToProps)(UnconnectedReservationCalendar)
  )
);
