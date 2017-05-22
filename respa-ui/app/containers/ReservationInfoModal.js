import includes from 'lodash/includes';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import Modal from 'react-bootstrap/lib/Modal';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeReservationInfoModal } from 'actions/uiActions';
import { putReservation } from 'actions/reservationActions';
import TimeRange from 'components/common/TimeRange';
import reservationInfoModalSelector from 'selectors/containers/reservationInfoModalSelector';
import {
  isStaffEvent,
  getMissingReservationValues,
  getName,
} from 'utils/DataUtils';
import { renderReservationStateLabel } from 'utils/renderUtils';

const messages = defineMessages({
  address: {
    id: 'reservation_info.address',
    defaultMessage: 'Osoite:',
  },
  billingAddress: {
    id: 'reservation_info.billing_address',
    defaultMessage: 'Laskutusosoite:',
  },
  comments: {
    id: 'reservation_info.comments',
    defaultMessage: 'Kommentit:',
  },
  commentsHelp: {
    id: 'reservation_info.comments_help',
    defaultMessage: 'Varauksen mahdolliset lisätiedot',
  },
  eventDescription: {
    id: 'reservation_info.event_description',
    defaultMessage: 'Lisätiedot:',
  },
  numberOfParticipants: {
    id: 'reservation_info.number_of_participants',
    defaultMessage: 'Osallistujamäärä:',
  },
  reservationTime: {
    id: 'reservation_info.reservation_time',
    defaultMessage: 'Varauksen ajankohta:',
  },
  reserverEmailAddress: {
    id: 'reservation_info.reserver_email',
    defaultMessage: 'Sähköposti:',
  },
  reserverId: {
    id: 'reservation_info.reserver_id',
    defaultMessage: 'Y-tunnus / henkilötunnus:',
  },
  reserverName: {
    id: 'reservation_info.reserver_name',
    defaultMessage: 'Varaaja / vuokraaja',
  },
  reserverPhoneNumber: {
    id: 'reservation_info.reserver_phone_number',
    defaultMessage: 'Puhelinnumero:',
  },
  resource: {
    id: 'reservation_info.resource',
    defaultMessage: 'Tila:',
  },
});

export class UnconnectedReservationInfoModal extends Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
  }

  getAddress(street, zip, city) {
    const ending = `${zip} ${city}`;
    if (street && (zip || city)) {
      return `${street}, ${ending}`;
    }
    return `${street} ${ending}`;
  }

  handleSave() {
    const { actions, reservationsToShow, resources } = this.props;
    const reservation = reservationsToShow.length ? reservationsToShow[0] : undefined;
    if (!reservation) {
      return;
    }
    const resource = reservation ? resources[reservationsToShow[0].resource] : {};
    const staffEvent = isStaffEvent(reservation, resource);
    const missingValues = getMissingReservationValues(reservation);
    const comments = this.refs.commentsInput.getValue();
    actions.putReservation(Object.assign(
      {},
      reservation,
      missingValues,
      { comments },
      { staffEvent }
    ));
    actions.closeReservationInfoModal();
  }

  renderModalContent(reservation, resource, isAdmin, isStaff, intl) {
    if (!reservation) {
      return null;
    }

    return (
      <div>
        {renderReservationStateLabel(reservation, intl.locale)}
        <dl className="dl-horizontal">
          <dt>{intl.formatMessage(messages.reserverName)}</dt>
          <dd>{reservation.reserverName}</dd>
          {isStaff && reservation.reserverId && (
            <span>
              <dt>{intl.formatMessage(messages.reserverId)}</dt>
              <dd>{reservation.reserverId}</dd>
            </span>
          )}
          <dt>{intl.formatMessage(messages.reserverPhoneNumber)}</dt>
          <dd>{reservation.reserverPhoneNumber}</dd>
          <dt>{intl.formatMessage(messages.reserverEmailAddress)}</dt>
          <dd>{reservation.reserverEmailAddress}</dd>
          <dt>{intl.formatMessage(messages.eventDescription)}</dt>
          <dd>{reservation.eventDescription}</dd>
          <dt>{intl.formatMessage(messages.numberOfParticipants)}</dt>
          <dd>{reservation.numberOfParticipants}</dd>
          {reservation.reserverAddressStreet &&
            <dt>{intl.formatMessage(messages.address)}</dt>
          }
          {reservation.reserverAddressStreet &&
            <dd>
              {this.getAddress(
                reservation.reserverAddressStreet,
                reservation.reserverAddressZip,
                reservation.reserverAddressCity
              )}
            </dd>
          }
          {reservation.billingAddressStreet &&
            <dt>{intl.formatMessage(messages.billingAddress)}</dt>
          }
          {reservation.billingAddressStreet &&
            <dd>
              {this.getAddress(
                reservation.billingAddressStreet,
                reservation.billingAddressZip,
                reservation.billingAddressCity
              )}
            </dd>
          }
          <dt>{intl.formatMessage(messages.reservationTime)}</dt>
          <dd><TimeRange begin={reservation.begin} end={reservation.end} /></dd>
          <dt>{intl.formatMessage(messages.resource)}</dt>
          <dd>{getName(resource, intl.locale)}</dd>
          {isAdmin && reservation.state === 'cancelled' && (
            <span>
              <dt>{intl.formatMessage(messages.comments)}</dt>
              <dd>{reservation.comments}</dd>
            </span>
          )}
        </dl>
        {isAdmin && reservation.state !== 'cancelled' && (
          <form>
            <Input
              defaultValue={reservation.comments}
              label={intl.formatMessage(messages.comments)}
              placeholder={intl.formatMessage(messages.commentsHelp)}
              ref="commentsInput"
              rows={5}
              type="textarea"
            />
          </form>
        )}
      </div>
    );
  }

  render() {
    const {
      actions,
      intl,
      isEditingReservations,
      reservationsToShow,
      resources,
      show,
      staffUnits,
    } = this.props;

    const reservation = reservationsToShow.length ? reservationsToShow[0] : undefined;
    const resource = reservation ? resources[reservationsToShow[0].resource] : {};
    const isAdmin = resource.userPermissions && resource.userPermissions.isAdmin;
    const isStaff = includes(staffUnits, resource.unit);
    const showSaveButton = isAdmin && reservation && reservation.state !== 'cancelled';

    return (
      <Modal
        className="reservation-info-modal"
        onHide={actions.closeReservationInfoModal}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title><FormattedMessage
            id="reservation_info.reservation_info"
            defaultMessage="Varauksen tiedot"
          /></Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.renderModalContent(reservation, resource, isAdmin, isStaff, intl)}
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="default"
            onClick={actions.closeReservationInfoModal}
          >
            <FormattedMessage
              id="reservation_info.back"
              defaultMessage="Takaisin"
            />
          </Button>
          {showSaveButton && (
            <Button
              bsStyle="success"
              disabled={isEditingReservations}
              onClick={this.handleSave}
              type="submit"
            >
              {isEditingReservations ?
                <FormattedMessage
                  id="reservation_info.saving"
                  defaultMessage="Tallennetaan..."
                /> :
                <FormattedMessage
                  id="reservation_info.save"
                  defaultMessage="Tallenna"
                />}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

UnconnectedReservationInfoModal.propTypes = {
  actions: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  isEditingReservations: PropTypes.bool.isRequired,
  reservationsToShow: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  staffUnits: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeReservationInfoModal,
    putReservation,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default injectIntl(connect(reservationInfoModalSelector, mapDispatchToProps)(
  UnconnectedReservationInfoModal
));
