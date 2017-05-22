import classNames from 'classnames';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Label from 'react-bootstrap/lib/Label';
import { defineMessages, injectIntl, intlShape } from 'react-intl';

import ReservationControls from 'containers/ReservationControls';
import { scrollTo } from 'utils/DOMUtils';

const messages = defineMessages({
  editing: {
    id: 'timeslot.editing',
    defaultMessage: 'Muokataan',
  },
  free: {
    id: 'timeslot.free',
    defaultMessage: 'Vapaa',
  },
  loginToReserve: {
    id: 'timeslot.login_to_reserve',
    defaultMessage: 'Kirjaudu sisään tehdäksesi varauksen tähän tilaan.',
  },
  notReservable: {
    id: 'timeslot.not_reservable',
    defaultMessage: 'Ei varattavissa',
  },
  reserved: {
    id: 'timeslot.reserved',
    defaultMessage: 'Varattu',
  },
});

class TimeSlot extends Component {
  constructor(props) {
    super(props);
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  componentDidMount() {
    if (this.props.scrollTo) {
      scrollTo(findDOMNode(this));
    }
  }

  getReservationInfoMessage(isLoggedIn, resource, slot) {
    const { intl } = this.props;
    if (moment(slot.end) < moment() || slot.reserved) {
      return null;
    }

    if (!isLoggedIn && resource.reservable) {
      return intl.formatMessage(messages.loginToReserve);
    }
    return resource.reservationInfo;
  }

  handleRowClick(disabled) {
    const {
      addNotification,
      isLoggedIn,
      onClick,
      resource,
      slot,
    } = this.props;

    if (disabled) {
      const message = this.getReservationInfoMessage(isLoggedIn, resource, slot);
      if (message) {
        const notification = {
          message,
          type: 'info',
          timeOut: 10000,
        };
        addNotification(notification);
      }
    } else {
      onClick(slot.asISOString);
    }
  }

  renderUserInfo(user) {
    if (!user) {
      return null;
    }

    return (
      <span>{user.displayName} - {user.email}</span>
    );
  }

  render() {
    const {
      disabled,
      intl,
      isAdmin,
      isEditing,
      isLoggedIn,
      isStaff,
      resource,
      selected,
      slot,
    } = this.props;
    const isPast = moment(slot.end) < moment();
    const isDisabled = (
      disabled ||
      !isLoggedIn ||
      !resource.userPermissions.canMakeReservations ||
      (!slot.editing && (slot.reserved || isPast)) ||
      ((!isAdmin || !isStaff) && !slot.reservable)
    );
    const checked = selected || (slot.reserved && !slot.editing);
    let labelBsStyle;
    let labelText;
    if (isPast) {
      labelBsStyle = 'default';
    } else {
      labelBsStyle = slot.reserved ? 'danger' : 'success';
    }
    if (slot.editing) {
      labelBsStyle = 'info';
      labelText = intl.formatMessage(messages.editing);
    } else if ((!isAdmin || !isStaff) && (!slot.reservable || isPast)) {
      labelBsStyle = 'default';
      labelText = intl.formatMessage(messages.notReservable);
    } else {
      labelText = slot.reserved ?
        intl.formatMessage(messages.reserved) :
        intl.formatMessage(messages.free);
    }
    const reservation = slot.reservation;

    return (
      <tr
        className={classNames({
          isDisabled,
          'is-admin': isAdmin,
          editing: slot.editing,
          past: isPast,
          'reservation-starting': isAdmin && slot.reservationStarting,
          'reservation-ending': isAdmin && slot.reservationEnding,
          reserved: slot.reserved,
          selected,
        })}
        onClick={() => this.handleRowClick(isDisabled)}
      >
        <td className="checkbox-cell">
          <Glyphicon
            glyph={checked ? 'check' : 'unchecked'}
            style={{ visibility: (disabled ? 'hidden' : null) }}
          />
        </td>
        <td className="time-cell">
          <time dateTime={slot.asISOString}>
            {slot.asString}
          </time>
        </td>
        <td className="status-cell">
          <Label bsStyle={labelBsStyle}>
            {labelText}
          </Label>
        </td>
        {isAdmin && (
          <td className="user-cell">
            {reservation && slot.reservationStarting && this.renderUserInfo(reservation.user)}
          </td>
        )}
        {isAdmin && (
          <td className="comments-cell">
            {reservation && slot.reservationStarting && reservation.comments}
          </td>
        )}
        {isAdmin && (
          <td className="controls-cell">
            {reservation && slot.reservationStarting && !isEditing && (
              <ReservationControls
                isAdmin={isAdmin}
                isStaff={isStaff}
                reservation={reservation}
                resource={resource}
              />
            )}
          </td>
        )}
      </tr>
    );
  }
}

TimeSlot.propTypes = {
  addNotification: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  scrollTo: PropTypes.bool,
  selected: PropTypes.bool.isRequired,
  slot: PropTypes.object.isRequired,
};

export default injectIntl(TimeSlot);
