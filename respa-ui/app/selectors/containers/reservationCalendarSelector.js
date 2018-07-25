import filter from 'lodash/filter';
import includes from 'lodash/includes';
import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import dateSelector from 'selectors/dateSelector';
import fetchDatesSelector from 'selectors/fetchDatesSelector';
import isLoggedInSelector from 'selectors/isLoggedInSelector';
import passwordRequiredForLoginSelector from 'selectors/passwordRequiredForLoginSelector';
import resourceAvailabilityByDaySelector from 'selectors/resourceAvailabilityByDaySelector';
import resourceSelector from 'selectors/resourceSelector';
import timeSelector from 'selectors/timeSelector';
import selectedReservationsSelector from 'selectors/selectedReservationsSelector';
import staffUnitsSelector from 'selectors/staffUnitsSelector';
import modalIsOpenSelectorFactory from 'selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';
import { getOpeningHours } from 'utils/DataUtils';
import { getStartAndEndOfReservations, getTimeSlots } from 'utils/TimeUtils';
import ModalTypes from 'constants/ModalTypes';

const idSelector = (state, props) => props.params.id;
const multiDaySelector = (state) => state.ui.reservations.multiDay;
const selectedSelector = (state) => state.ui.reservations.selected;
const toEditSelector = (state) => state.ui.reservations.toEdit;
const urlHashSelector = (state, props) => props.location.hash;

const reservationCalendarSelector = createSelector(
  idSelector,
  isLoggedInSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.LOGIN_POST_REQUEST),
  passwordRequiredForLoginSelector,
  modalIsOpenSelectorFactory(ModalTypes.RESERVATION_CONFIRM),
  requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_POST_REQUEST),
  requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  dateSelector,
  fetchDatesSelector,
  resourceAvailabilityByDaySelector,
  resourceSelector,
  selectedSelector,
  selectedReservationsSelector,
  staffUnitsSelector,
  timeSelector,
  toEditSelector,
  urlHashSelector,
  multiDaySelector,
  (
    id,
    isLoggedIn,
    isLoggingIn,
    passwordRequired,
    confirmReservationModalIsOpen,
    isMakingReservations,
    isFetchingResource,
    date,
    fetchDates,
    calendarAvailability,
    resource,
    selected,
    selectedReservations,
    staffUnits,
    time,
    reservationsToEdit,
    urlHash,
    multiDay
  ) => {
    let { closes, opens } = getOpeningHours(resource, date);
    const period = resource.minPeriod ? resource.minPeriod : undefined;
    const reservations = resource.reservations || undefined;
    const openReservations = filter(reservations, (reservation) => {
      const openStates = ['confirmed', 'requested'];
      return includes(openStates, reservation.state);
    });
    const reservationsAllowed = opens && closes;
    const reservableBefore = resource.reservableBefore;
    const reservableAfter = resource.reservableAfter;
    if (!opens) {
      const reservationTimes = getStartAndEndOfReservations(date, openReservations);
      closes = reservationTimes.closes;
      opens = reservationTimes.opens;
    }
    const timeSlots = getTimeSlots(opens, closes, period, openReservations, reservationsToEdit,
      reservableBefore, reservableAfter, false, reservationsAllowed);

    return {
      calendarAvailability,
      confirmReservationModalIsOpen,
      date,
      fetchDates,
      id,
      isFetchingResource,
      isLoggedIn,
      isLoggingIn,
      isMakingReservations,
      multiDay,
      passwordRequired,
      reservationsToEdit,
      resource,
      selected,
      selectedReservations,
      staffUnits,
      time,
      timeSlots,
      urlHash,
    };
  }
);

export default reservationCalendarSelector;
