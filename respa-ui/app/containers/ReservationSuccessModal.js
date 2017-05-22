import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeReservationSuccessModal } from 'actions/uiActions';
import CompactReservationsList from 'components/common/CompactReservationsList';
import reservationSuccessModalSelector from 'selectors/containers/reservationSuccessModalSelector';
import { getName } from 'utils/DataUtils';

export class UnconnectedReservationSuccessModal extends Component {
  renderEmail(email) {
    if (!email) {
      return '';
    }
    return <strong> {email}</strong>;
  }

  render() {
    const {
      actions,
      intl,
      reservationsToShow,
      resources,
      show,
    } = this.props;

    const reservation = reservationsToShow.length ? reservationsToShow[0] : {};
    const resource = reservation.resource ? resources[reservation.resource] : {};

    return (
      <Modal
        className="reservation-success-modal"
        onHide={actions.closeReservationSuccessModal}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title><FormattedMessage
            id="reservation_success.sent"
            defaultMessage="Varauspyyntösi on lähetetty"
          /></Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            <FormattedMessage
              id="reservation_success.made_preliminary"
              defaultMessage="Olet tehnyt alustavan varauksen tilaan {name} {
                              times, plural, one {ajalle} other {ajoille} }:"
              values={{
                name: getName(resource, intl.locale),
                times: reservationsToShow.length,
              }}
            />
          </p>
          <CompactReservationsList reservations={reservationsToShow} />
          <p>
            <FormattedMessage
              id="reservation_success.info_email"
              defaultMessage="Tarkemmat tiedot alustavasta varauksesta
            lähetetään varauksen yhteydessä annettuun sähköpostiosoitteeseen "
            />
            {this.renderEmail(reservation.reserverEmailAddress)}.
          </p>
          {resource.responsibleContactInfo && <p>{resource.responsibleContactInfo}</p>}
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="default"
            onClick={actions.closeReservationSuccessModal}
          >
            Takaisin
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

UnconnectedReservationSuccessModal.propTypes = {
  actions: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  reservationsToShow: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeReservationSuccessModal,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default injectIntl(connect(reservationSuccessModalSelector, mapDispatchToProps)(
  UnconnectedReservationSuccessModal
));
