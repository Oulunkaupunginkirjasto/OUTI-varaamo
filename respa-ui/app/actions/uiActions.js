import { createAction } from 'redux-actions';

import types from 'constants/ActionTypes';
import constants from 'constants/AppConstants';
import ModalTypes from 'constants/ModalTypes';

const cancelReservationEdit = createAction(types.UI.CANCEL_RESERVATION_EDIT);

const changeAdminReservationsFilters = createAction(types.UI.CHANGE_ADMIN_RESERVATIONS_FILTERS);

const changeMultiDayReservationRange = createAction(
  types.UI.CHANGE_MULTIDAY_RESERVATION_RANGE,
  (begin, end) => ({ begin, end })
);

const changeSearchFilters = createAction(types.UI.CHANGE_SEARCH_FILTERS);

const chooseEnglishLocale = createAction(
  types.UI.CHANGE_LOCALE,
  () => constants.LOCALES.english
);

const chooseFinnishLocale = createAction(
  types.UI.CHANGE_LOCALE,
  () => constants.LOCALES.finnish
);

const clearReservations = createAction(types.UI.CLEAR_RESERVATIONS);

const closeConfirmReservationModal = createAction(
  types.UI.CLOSE_MODAL,
  () => ModalTypes.RESERVATION_CONFIRM
);

const closeLoginModal = createAction(
  types.UI.CLOSE_MODAL,
  () => ModalTypes.LOGIN
);

const closeReservationCancelModal = createAction(
  types.UI.CLOSE_MODAL,
  () => ModalTypes.RESERVATION_CANCEL
);

const closeReservationInfoModal = createAction(
  types.UI.CLOSE_MODAL,
  () => ModalTypes.RESERVATION_INFO
);

const closeReservationSuccessModal = createAction(
  types.UI.CLOSE_MODAL,
  () => ModalTypes.RESERVATION_SUCCESS
);

const openConfirmReservationModal = createAction(
  types.UI.OPEN_MODAL,
  () => ModalTypes.RESERVATION_CONFIRM
);

const openLoginModal = createAction(
  types.UI.OPEN_MODAL,
  () => ModalTypes.LOGIN
);

const openReservationCancelModal = createAction(
  types.UI.OPEN_MODAL,
  () => ModalTypes.RESERVATION_CANCEL
);

const openReservationInfoModal = createAction(
  types.UI.OPEN_MODAL,
  () => ModalTypes.RESERVATION_INFO
);

const selectReservationToCancel = createAction(
  types.UI.SELECT_RESERVATION_TO_CANCEL
);

const selectReservationToEdit = createAction(
  types.UI.SELECT_RESERVATION_TO_EDIT
);

const selectReservationToShow = createAction(
  types.UI.SELECT_RESERVATION_TO_SHOW
);

const toggleTimeSlot = createAction(types.UI.TOGGLE_TIME_SLOT);

export {
  cancelReservationEdit,
  changeAdminReservationsFilters,
  changeMultiDayReservationRange,
  changeSearchFilters,
  chooseEnglishLocale,
  chooseFinnishLocale,
  clearReservations,
  closeConfirmReservationModal,
  closeLoginModal,
  closeReservationCancelModal,
  closeReservationInfoModal,
  closeReservationSuccessModal,
  openConfirmReservationModal,
  openLoginModal,
  openReservationCancelModal,
  openReservationInfoModal,
  selectReservationToCancel,
  selectReservationToEdit,
  selectReservationToShow,
  toggleTimeSlot,
};
