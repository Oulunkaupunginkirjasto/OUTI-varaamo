import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePath } from 'redux-simple-router';

import {
  openReservationCancelModal,
  openReservationInfoModal,
  selectReservationToCancel,
  selectReservationToEdit,
  selectReservationToShow,
} from 'actions/uiActions';
import {
  confirmPreliminaryReservation,
  denyPreliminaryReservation,
} from 'actions/reservationActions';
import ReservationControls from 'components/reservation/ReservationControls';

export class UnconnectedReservationControls extends Component {
  constructor(props) {
    super(props);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.handleDenyClick = this.handleDenyClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleInfoClick = this.handleInfoClick.bind(this);
  }

  handleCancelClick() {
    const { actions, reservation } = this.props;
    actions.selectReservationToCancel(reservation);
    actions.openReservationCancelModal();
  }

  handleConfirmClick() {
    const {
      actions,
      isAdmin,
      reservation,
    } = this.props;

    if (isAdmin && reservation.state === 'requested') {
      actions.confirmPreliminaryReservation(reservation);
    }
  }

  handleDenyClick() {
    const {
      actions,
      isAdmin,
      reservation,
    } = this.props;

    if (isAdmin && reservation.state === 'requested') {
      actions.denyPreliminaryReservation(reservation);
    }
  }

  handleEditClick() {
    const {
      actions,
      reservation,
      resource,
    } = this.props;
    const query = queryString.stringify({
      date: reservation.begin.split('T')[0],
      time: reservation.begin,
    });

    actions.selectReservationToEdit({ reservation, minPeriod: resource.minPeriod });
    actions.updatePath(`/resources/${reservation.resource}/reservation?${query}`);
  }

  handleInfoClick() {
    const { actions, reservation } = this.props;

    actions.selectReservationToShow(reservation);
    actions.openReservationInfoModal();
  }

  render() {
    const {
      isAdmin,
      isStaff,
      reservation,
    } = this.props;

    return (
      <ReservationControls
        isAdmin={isAdmin}
        isStaff={isStaff}
        onCancelClick={this.handleCancelClick}
        onConfirmClick={this.handleConfirmClick}
        onDenyClick={this.handleDenyClick}
        onEditClick={this.handleEditClick}
        onInfoClick={this.handleInfoClick}
        reservation={reservation}
      />
    );
  }
}

UnconnectedReservationControls.propTypes = {
  actions: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    confirmPreliminaryReservation,
    denyPreliminaryReservation,
    openReservationCancelModal,
    openReservationInfoModal,
    updatePath,
    selectReservationToCancel,
    selectReservationToEdit,
    selectReservationToShow,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(null, mapDispatchToProps)(UnconnectedReservationControls);
