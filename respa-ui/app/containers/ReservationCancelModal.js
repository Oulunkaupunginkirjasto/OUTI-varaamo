import forEach from 'lodash/forEach';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteReservation } from 'actions/reservationActions';
import { closeReservationCancelModal } from 'actions/uiActions';
import CompactReservationsList from 'components/common/CompactReservationsList';
import reservationCancelModalSelector from 'selectors/containers/reservationCancelModalSelector';

export class UnconnectedReservationCancelModal extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel() {
    const { actions, reservationsToCancel } = this.props;

    forEach(reservationsToCancel, (reservation) => {
      actions.deleteReservation(reservation);
    });
    actions.closeReservationCancelModal();
  }

  renderModalContent(reservations, resources, cancelAllowed, responsibleContactInfo) {
    if (cancelAllowed) {
      return (
        <div>
          <FormattedMessage
            id="reservation_cancel.are_you_sure"
            defaultMessage={`Oletko varma että haluat perua {num, plural,
              one {seuraavan varauksen}
              other {seuraavat varaukset}
              }:`}
            values={{ num: reservations.length }}
          />
          <CompactReservationsList reservations={reservations} resources={resources} />
        </div>
      );
    }

    return (
      <div>
        <p>
          <FormattedMessage
            id="reservation_cancel.by_contact"
            defaultMessage="Varauksen peruminen täytyy tehdä tilasta vastaavan virkailijan kautta.
            Mikäli haluat perua varauksen tai tehdä muutoksia varausaikaan ole yhteydessä tilasta
            vastaavaan virkailijaan."
          />
        </p>
        <p className="responsible-contact-info">{responsibleContactInfo}</p>
      </div>
    );
  }

  render() {
    const {
      actions,
      isAdmin,
      isCancellingReservations,
      reservationsToCancel,
      resources,
      show,
    } = this.props;

    const reservation = reservationsToCancel.length ? reservationsToCancel[0] : null;
    const resource = reservation ? resources[reservation.resource] : {};
    const state = reservation ? reservation.state : '';
    const isPreliminaryReservation = reservation && reservation.needManualConfirmation;
    const cancelAllowed = (
      !isPreliminaryReservation ||
      isAdmin ||
      state !== 'confirmed'
    );

    return (
      <Modal
        onHide={actions.closeReservationCancelModal}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {cancelAllowed ?
              <FormattedMessage
                id="reservation_cancel.titleConfirm"
                defaultMessage="Perumisen vahvistus"
              /> :
              <FormattedMessage
                id="reservation_cancel.titlePreliminary"
                defaultMessage="Varauksen peruminen"
              />}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.renderModalContent(
            reservationsToCancel, resources, cancelAllowed, resource.responsibleContactInfo
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="default"
            onClick={actions.closeReservationCancelModal}
          >
            {cancelAllowed ?
              <FormattedMessage
                id="reservation_cancel.do_not_cancel"
                defaultMessage="Älä peru varausta"
              /> :
              <FormattedMessage
                id="reservation_cancel.back"
                defaultMessage="Takaisin"
              />}
          </Button>
          {cancelAllowed && (
            <Button
              bsStyle="danger"
              disabled={isCancellingReservations}
              onClick={this.handleCancel}
            >
              {isCancellingReservations ?
                <FormattedMessage
                  id="reservation_cancel.canceling"
                  defaultMessage="Perutaan..."
                /> :
                <FormattedMessage
                  id="reservation_cancel.cancel"
                  defaultMessage="Peru varaus"
                />}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

UnconnectedReservationCancelModal.propTypes = {
  actions: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isCancellingReservations: PropTypes.bool.isRequired,
  reservationsToCancel: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeReservationCancelModal,
    deleteReservation,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationCancelModalSelector, mapDispatchToProps)(
  UnconnectedReservationCancelModal
);
