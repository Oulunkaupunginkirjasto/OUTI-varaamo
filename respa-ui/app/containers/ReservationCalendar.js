import includes from 'lodash/includes';
import forEach from 'lodash/forEach';
import tail from 'lodash/tail';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
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
import DateHeader from 'components/common/DateHeader';
import ConfirmReservationModal from 'components/reservation/ConfirmReservationModal';
import MultiDayReservation from 'components/reservation/MultiDayReservation';
import ReservationCalendarControls from 'components/reservation/ReservationCalendarControls';
import TimeSlots from 'components/reservation/TimeSlots';
import ReservationCancelModal from 'containers/ReservationCancelModal';
import ReservationInfoModal from 'containers/ReservationInfoModal';
import ReservationSuccessModal from 'containers/ReservationSuccessModal';
import reservationCalendarSelector from 'selectors/containers/reservationCalendarSelector';

export class UnconnectedReservationCalendar extends Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleEditCancel = this.handleEditCancel.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleMultiDayCancel = this.handleMultiDayCancel.bind(this);
    this.handleMultiDayChangeBegin = this.handleMultiDayChangeBegin.bind(this);
    this.handleMultiDayChangeEnd = this.handleMultiDayChangeEnd.bind(this);
    this.handleMultiDayOpen = this.handleMultiDayOpen.bind(this);
    this.handleReservation = this.handleReservation.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  componentWillUnmount() {
    this.props.actions.clearReservations();
  }

  onDateChange(newDate) {
    const { actions, id } = this.props;
    actions.updatePath(`/resources/${id}/reservation?date=${newDate}`);
  }

  handleEdit(values = {}) {
    const {
      actions,
      reservationsToEdit,
      selectedReservations,
    } = this.props;

    if (selectedReservations.length) {
      // Edit the first selected reservation.
      actions.putReservation(Object.assign(
        {},
        selectedReservations[0],
        values,
        { url: reservationsToEdit[0].url }
      ));

      // Add new reservations if needed.
      // FIXME: This is very hacky and not bulletproof but use cases where user splits
      // one reservation into multiple reservations should be pretty rare.
      // Try to use something sequential in the future.
      // Use timeout to allow the PUT request to go through first and possibly free previously
      // reserved time slots.
      setTimeout(() => {
        forEach(tail(selectedReservations), (reservation) => {
          actions.postReservation(
            Object.assign({}, reservation, values)
          );
        });
      }, 800);
    } else {
      // Delete the edited reservation if no time slots were selected.
      forEach(reservationsToEdit, (reservation) => {
        actions.deleteReservation(reservation);
      });
    }
  }

  handleEditCancel() {
    this.props.actions.cancelReservationEdit();
  }

  handleLogin(values = {}) {
    const {
      actions,
    } = this.props;
    actions.postLogin(values);
  }

  handleMultiDayCancel() {
    const { actions } = this.props;
    actions.changeMultiDayReservationRange(null, null);
  }

  handleMultiDayChangeBegin(newDate) {
    const { actions, multiDay } = this.props;
    if (moment(newDate).isAfter(moment(multiDay.end))) {
      actions.changeMultiDayReservationRange(newDate, newDate);
    } else {
      actions.changeMultiDayReservationRange(newDate, multiDay.end);
    }
  }

  handleMultiDayChangeEnd(newDate) {
    const { actions, multiDay } = this.props;
    if (moment(newDate).isBefore(moment(multiDay.begin))) {
      actions.changeMultiDayReservationRange(newDate, newDate);
    } else {
      actions.changeMultiDayReservationRange(multiDay.begin, newDate);
    }
  }

  handleMultiDayOpen() {
    const { actions, date } = this.props;
    actions.changeMultiDayReservationRange(date, date);
  }

  handleReservation(values = {}) {
    const { actions, selectedReservations } = this.props;

    selectedReservations.forEach(reservation => {
      actions.postReservation(
        Object.assign({}, reservation, values)
      );
    });
  }

  render() {
    const {
      actions,
      calendarAvailability,
      confirmReservationModalIsOpen,
      date,
      fetchDates,
      isFetchingResource,
      isLoggedIn,
      isLoggingIn,
      isMakingReservations,
      multiDay,
      onCalendarViewDateChange,
      passwordRequired,
      reservationsToEdit,
      resource,
      selected,
      selectedReservations,
      staffUnits,
      time,
      timeSlots,
      urlHash,
    } = this.props;

    const isAdmin = resource.userPermissions.isAdmin;
    const isEditing = Boolean(reservationsToEdit.length);
    const isStaff = includes(staffUnits, resource.unit);
    const isMultiDayAllowed = (resource.maxPeriod &&
      moment.duration(resource.maxPeriod).asHours() >= 24);

    return (
      <div>
        <DateHeader
          date={date}
          onChange={this.onDateChange}
          scrollTo={urlHash === '#date-header'}
        />
        {isMultiDayAllowed && !isEditing &&
          <MultiDayReservation
            calendarAvailability={calendarAvailability}
            fetchDates={fetchDates}
            beginDate={multiDay.begin}
            endDate={multiDay.end}
            defaultDate={date}
            onCalendarViewDateChange={onCalendarViewDateChange}
            onCancel={this.handleMultiDayCancel}
            onChangeBeginDate={this.handleMultiDayChangeBegin}
            onChangeEndDate={this.handleMultiDayChangeEnd}
            onConfirm={actions.openConfirmReservationModal}
            onOpen={this.handleMultiDayOpen}
          />}
        <TimeSlots
          addNotification={actions.addNotification}
          disabled={multiDay.begin != null}
          isAdmin={isAdmin}
          isEditing={isEditing}
          isFetching={isFetchingResource}
          isLoggedIn
          isStaff={isStaff}
          onClick={actions.toggleTimeSlot}
          resource={resource}
          selected={selected}
          slots={timeSlots}
          time={time}
        />
        <ReservationCalendarControls
          addNotification={actions.addNotification}
          disabled={(
            !resource.userPermissions.canMakeReservations ||
            !selected.length ||
            isMakingReservations
          )}
          isEditing={isEditing}
          isLoggedIn={isLoggedIn}
          isMakingReservations={isMakingReservations}
          openLoginModal={actions.openLoginModal}
          onCancel={this.handleEditCancel}
          onClick={actions.openConfirmReservationModal}
          resource={resource}
        />
        <ConfirmReservationModal
          isAdmin={isAdmin}
          isEditing={isEditing}
          isLoggedIn={isLoggedIn}
          isLoggingIn={isLoggingIn}
          isMakingReservations={isMakingReservations}
          isPreliminaryReservation={resource.needManualConfirmation}
          isStaff={isStaff}
          onClose={actions.closeConfirmReservationModal}
          onConfirm={isEditing ? this.handleEdit : this.handleReservation}
          onLogin={this.handleLogin}
          passwordRequired={passwordRequired}
          reservationsToEdit={reservationsToEdit}
          resource={resource}
          selectedReservations={selectedReservations}
          show={confirmReservationModalIsOpen}
        />
        <ReservationCancelModal />
        <ReservationInfoModal />
        <ReservationSuccessModal />
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
