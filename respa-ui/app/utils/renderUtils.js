import React from 'react';
import Label from 'react-bootstrap/lib/Label';

import constants from 'constants/AppConstants';

function capitalizeFirstLetter(dateString) {
  if (dateString) {
    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
  }
  return dateString;
}

function onRenderDayAvailability(props, availability) {
  const day = props.date.format(constants.DATE_FORMAT);
  if (availability[day] === constants.DAY_AVAILABILITY.available) {
    const className = `${props.className} available`;
    return Object.assign({}, props, { className });
  } else if (availability[day] === constants.DAY_AVAILABILITY.allReserved) {
    const className = `${props.className} unavailable`;
    return Object.assign({}, props, { className });
  } else if (availability[day] === constants.DAY_AVAILABILITY.noTimes) {
    const className = `${props.className} notimes`;
    return Object.assign({}, props, { className });
  }
  return props;
}

function renderReservationStateLabel(reservation, language = 'fi') {
  if (!reservation.needManualConfirmation && reservation.state !== 'cancelled') {
    return null;
  }

  const { labelBsStyle, labelText } = constants.RESERVATION_STATE_LABELS[reservation.state];

  return (
    <div className="state">
      <Label bsStyle={labelBsStyle}>{labelText[language]}</Label>
    </div>
  );
}

export {
  capitalizeFirstLetter,
  onRenderDayAvailability,
  renderReservationStateLabel,
};
