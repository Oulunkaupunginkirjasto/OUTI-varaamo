import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';

const messages = defineMessages({
  chooseTime: {
    id: 'reservation_calendar.choose_time',
    defaultMessage: 'Valitse aika, jolle haluat tehdä varauksen.',
  },
  confirmChanges: {
    id: 'reservation_calendar.confirm_changes',
    defaultMessage: 'Vahvista muutokset',
  },
  reserve: {
    id: 'reservation_calendar.reserve',
    defaultMessage: 'Varaa',
  },
  reserving: {
    id: 'reservation_calendar.reserving',
    defaultMessage: 'Varataan...',
  },
  saving: {
    id: 'reservation_calendar.saving',
    defaultMessage: 'Tallennetaan...',
  },
});

class ReservationCalendarControls extends Component {
  constructor(props) {
    super(props);
    this.handleMainClick = this.handleMainClick.bind(this);
  }

  getButtonText(isEditing, isMakingReservations, intl) {
    if (isEditing) {
      return isMakingReservations ?
        intl.formatMessage(messages.saving) :
        intl.formatMessage(messages.confirmChanges);
    }
    return isMakingReservations ?
      intl.formatMessage(messages.reserving) :
      intl.formatMessage(messages.reserve);
  }

  getReservationInfoMessage(resource, intl) {
    if (resource.reservable) {
      return intl.formatMessage(messages.chooseTime);
    }
    return resource.reservationInfo;
  }

  handleMainClick() {
    const {
      addNotification,
      disabled,
      intl,
      onClick,
      resource,
    } = this.props;

    if (disabled) {
      const message = this.getReservationInfoMessage(resource, intl);
      if (message) {
        const notification = {
          message,
          type: 'info',
          timeOut: 10000,
        };
        addNotification(notification);
      }
    } else {
      onClick();
    }
  }

  render() {
    const {
      disabled,
      intl,
      isEditing,
      isMakingReservations,
      onCancel,
    } = this.props;

    return (
      <div>
        <ButtonGroup style={{ width: '100%' }}>
          <Button
            bsStyle="primary"
            className={classNames({ disabled })}
            onClick={this.handleMainClick}
            style={{ width: isEditing ? '50%' : '100%' }}
          >
            {this.getButtonText(isEditing, isMakingReservations, intl)}
          </Button>
          {isEditing && (
            <Button
              bsStyle="default"
              onClick={onCancel}
              style={{ width: '50%' }}
            >
              <FormattedMessage
                id="reservation_calendar.back"
                defaultMessage="Takaisin"
              />
            </Button>
          )}
        </ButtonGroup>
      </div>
    );
  }
}

ReservationCalendarControls.propTypes = {
  addNotification: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  openLoginModal: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
};

export default injectIntl(ReservationCalendarControls);
