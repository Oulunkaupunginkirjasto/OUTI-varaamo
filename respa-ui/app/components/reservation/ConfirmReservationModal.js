import pick from 'lodash/pick';
import camelCase from 'lodash/camelCase';
import React, { Component, PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { logout } from 'actions/authActions';
import LoginForm from 'components/authentication/LoginForm';
import CompactReservationsList from 'components/common/CompactReservationsList';
import constants from 'constants/AppConstants';
import ReservationForm from 'containers/ReservationForm';
import { isStaffEvent } from 'utils/DataUtils';

const messages = defineMessages({
  confirmHelp: {
    id: 'reservation_modal.confirm_help',
    defaultMessage: `Oletko varma että haluat tehdä {num, plural,
      one {varauksen ajalle}
      other {varaukset ajoille}
      }:`,
  },
  preliminaryHelp: {
    id: 'reservation_modal.preliminary_help',
    defaultMessage: `Olet tekemässä alustavaa varausta {num, plural, 
      one {ajalle}
      other {ajoille}
      }:`,
  },
  titleConfirm: {
    id: 'reservation_modal.title_confirm',
    defaultMessage: 'Varauksen vahvistus',
  },
  titleEditing: {
    id: 'reservation_modal.title_editing',
    defaultMessage: 'Muutosten vahvistus',
  },
  titlePreliminary: {
    id: 'reservation_modal.title_preliminary',
    defaultMessage: 'Alustava varaus',
  },
});

class UnconnectedConfirmReservationModal extends Component {
  constructor(props) {
    super(props);
    this.getFormFields = this.getFormFields.bind(this);
    this.getFormInitialValues = this.getFormInitialValues.bind(this);
    this.getModalTitle = this.getModalTitle.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.renderIntroTexts = this.renderIntroTexts.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show && !this.props.isLoggedIn && nextProps.isLoggedIn) {
      // Hack. Maybe fixed with redux-form 6?
      this.refs.reservationForm.getWrappedInstance().submit();
      if (!this.props.passwordRequired) {
        this.props.actions.logout();
      }
    }
  }

  onLogin(values = {}) {
    const { onLogin } = this.props;
    onLogin(values);
  }

  onConfirm(values) {
    const { onClose, onConfirm } = this.props;
    onClose();
    onConfirm(values);
  }

  getFormFields() {
    const {
      isAdmin,
      isStaff,
      resource,
    } = this.props;
    const formFields = [];

    if (resource.needManualConfirmation) {
      formFields.push(...constants.RESERVATION_FORM_FIELDS);
    }

    if (isAdmin) {
      formFields.push('comments');
    }

    if (resource.needManualConfirmation && isStaff) {
      formFields.push('staffEvent');
    }

    if (resource.termsAndConditions) {
      formFields.push('termsAndConditions');
    }

    return formFields;
  }

  getFormInitialValues() {
    const {
      isEditing,
      reservationsToEdit,
      resource,
      selectedReservations,
    } = this.props;
    let reservation;

    if (isEditing) {
      reservation = reservationsToEdit.length ? reservationsToEdit[0] : null;
    } else {
      reservation = selectedReservations.length ? selectedReservations[0] : null;
    }

    let rv = reservation ?
      pick(reservation, ['comments', ...constants.RESERVATION_FORM_FIELDS]) :
      {};
    if (isEditing) {
      rv = Object.assign(rv, { staffEvent: isStaffEvent(reservation, resource) });
    }
    return rv;
  }

  getModalTitle(isEditing, isPreliminaryReservation) {
    const { intl } = this.props;
    if (isEditing) {
      return intl.formatMessage(messages.titleEditing);
    }
    if (isPreliminaryReservation) {
      return intl.formatMessage(messages.titlePreliminary);
    }
    return intl.formatMessage(messages.titleConfirm);
  }

  getRequiredFormFields(resource) {
    const requiredFormFields = [...resource.requiredReservationExtraFields.map(
      (field) => camelCase(field)
    )];

    if (resource.termsAndConditions) {
      requiredFormFields.push('termsAndConditions');
    }

    return requiredFormFields;
  }

  renderIntroTexts() {
    const {
      intl,
      isEditing,
      isPreliminaryReservation,
      reservationsToEdit,
      selectedReservations,
    } = this.props;

    if (isEditing) {
      return (
        <div>
          <p><strong>
            <FormattedMessage
              id="reservation_modal.editing_are_you_sure"
              defaultMessage="Oletko varma että haluat muuttaa varaustasi?"
            />
          </strong></p>
          <p><FormattedMessage
            id="reservation_modal.editing_before"
            defaultMessage="Ennen muutoksia:"
          /></p>
          <CompactReservationsList reservations={reservationsToEdit} />
          <p><FormattedMessage
            id="reservation_modal.editing_after"
            defaultMessage="Muutosten jälkeen:"
          /></p>
          <CompactReservationsList reservations={selectedReservations} />
        </div>
      );
    }

    let helpText;

    if (isPreliminaryReservation) {
      helpText = intl.formatMessage(
        messages.preliminaryHelp,
        { num: selectedReservations.length }
      );
    } else {
      helpText = intl.formatMessage(
        messages.confirmHelp,
        { num: selectedReservations.length }
      );
    }

    return (
      <div>
        <p><strong>{helpText}</strong></p>
        <CompactReservationsList reservations={selectedReservations} />
        {isPreliminaryReservation && (
          <div>
            <p>
              <FormattedMessage
                id="reservation_modal.preliminary_form_help"
                defaultMessage="Täytä vielä seuraavat tiedot alustavaa varausta varten.
                                Tähdellä (*) merkityt tiedot ovat pakollisia."
              />
            </p>
          </div>
        )}
      </div>
    );
  }

  render() {
    const {
      isEditing,
      isLoggedIn,
      isLoggingIn,
      isMakingReservations,
      isPreliminaryReservation,
      passwordRequired,
      onClose,
      resource,
      show,
    } = this.props;

    const loginFields = ['username'];
    if (passwordRequired) {
      loginFields.push('password');
    }

    return (
      <Modal
        animation={false}
        backdrop="static"
        className="confirm-reservation-modal"
        onHide={onClose}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {this.getModalTitle(isEditing, isPreliminaryReservation)}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.renderIntroTexts()}
          <ReservationForm
            ref="reservationForm"
            fields={this.getFormFields()}
            initialValues={this.getFormInitialValues()}
            isMakingReservations={isMakingReservations}
            onClose={onClose}
            onConfirm={this.onConfirm}
            onSubmit={this.onConfirm}
            requiredFields={this.getRequiredFormFields(resource)}
            showButtons={isLoggedIn}
          />
          {!isLoggedIn &&
            <LoginForm
              fields={loginFields}
              isLoggingIn={isLoggingIn}
              loginButtonText={
                <FormattedMessage
                  id="login.login_and_save"
                  defaultMessage="Kirjaudu sisään ja tallenna"
                />
              }
              onClose={onClose}
              onLogin={this.onLogin}
              visible={!isLoggedIn && show}
            />
          }
        </Modal.Body>
      </Modal>
    );
  }
}

UnconnectedConfirmReservationModal.propTypes = {
  actions: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isLoggingIn: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  isPreliminaryReservation: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  passwordRequired: PropTypes.bool.isRequired,
  reservationsToEdit: PropTypes.array.isRequired,
  resource: PropTypes.object.isRequired,
  selectedReservations: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    logout,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default injectIntl(
  connect(null, mapDispatchToProps)(UnconnectedConfirmReservationModal)
);
