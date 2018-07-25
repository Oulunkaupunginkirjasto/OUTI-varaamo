import forEach from 'lodash/forEach';
import map from 'lodash/map';
import moment from 'moment';
import 'moment-range';

import constants from 'constants/AppConstants';

function addToDate(date, daysToIncrement) {
  const newDate = moment(date).add(daysToIncrement, 'days');

  return newDate.format(constants.DATE_FORMAT);
}

function getDateStartAndEndTimes(date) {
  if (!date) {
    return {};
  }

  const start = `${date}T00:00:00Z`;
  const end = `${date}T23:59:59Z`;

  return { start, end };
}

function getDateString(date) {
  if (!date) {
    return moment().format(constants.DATE_FORMAT);
  }

  return date;
}

function getStartAndEndMoments(date, extendDate) {
  const dateMoment = moment(date);
  const earliestMoment = moment(dateMoment).startOf('month').startOf('week');
  const latestMoment = moment(earliestMoment).add(5, 'weeks').endOf('week');
  let extendMoment = null;
  if (extendDate) {
    extendMoment = moment(extendDate);
  }
  let startMoment = earliestMoment;
  if (extendMoment && startMoment > extendMoment) {
    startMoment = extendMoment;
  }
  let endMoment = latestMoment;
  if (extendMoment && endMoment < extendMoment) {
    endMoment = extendMoment;
  }
  return {
    startMoment,
    endMoment,
  };
}

function getStartAndEndTimes(date, extendDate) {
  if (!date) {
    return {};
  }
  const { startMoment, endMoment } = getStartAndEndMoments(date, extendDate);
  const startDate = startMoment.format(constants.DATE_FORMAT);
  const endDate = endMoment.format(constants.DATE_FORMAT);
  const start = `${startDate}T00:00:00Z`;
  const end = `${endDate}T23:59:59Z`;

  return { start, end };
}

function getStartAndEndOfReservations(date, reservations) {
  if (reservations && reservations.length) {
    const dateMoment = moment(date);
    let earliestStart = null;
    let latestEnd = null;
    forEach(reservations, (reservation) => {
      const beginMoment = moment(reservation.begin);

      if (!beginMoment.isSame(dateMoment, 'day')) {
        return;
      }

      const endMoment = moment(reservation.end);
      if (beginMoment < earliestStart || earliestStart === null) {
        earliestStart = beginMoment;
      }
      if (endMoment > latestEnd || latestEnd === null) {
        latestEnd = endMoment;
      }
    });
    if (earliestStart === null || latestEnd === null) {
      return {};
    }
    return { opens: earliestStart, closes: latestEnd };
  }
  return {};
}

function getTimeSlots(start, end, period = '00:30:00', reservations = [], reservationsToEdit = [],
                      reservableBefore, reservableAfter, limitEnd, reservationsAllowed = true) {
  if (!start || !end) {
    return [];
  }

  let range = moment.range(moment.utc(start), moment.utc(end));
  const duration = moment.duration(period);
  if (duration.asHours() >= 24) {
    range = moment.range(moment(start).startOf('day'), moment(end).endOf('day'));
  }
  const reservationRanges = map(reservations, reservation => (
    moment.range(moment(reservation.begin), moment(reservation.end))
  ));
  const editRanges = map(reservationsToEdit, reservation => (
    moment.range(moment(reservation.begin), moment(reservation.end))
  ));
  let reservableBeforeUTC = null;
  if (reservableBefore) {
    reservableBeforeUTC = moment.utc(reservableBefore);
  }
  let reservableAfterUTC = null;
  if (reservableAfter) {
    reservableAfterUTC = moment.utc(reservableAfter);
  }
  const rangeEndUTC = moment.utc(range.end);
  const slots = [];

  range.by(duration, (startMoment) => {
    const startUTC = moment.utc(startMoment);
    const endUTC = moment.utc(startMoment).add(duration);
    const startLocal = startUTC.local();
    const endLocal = endUTC.local();
    let visibleEnd = endLocal;
    if (limitEnd && endUTC.isAfter(rangeEndUTC)) {
      visibleEnd = rangeEndUTC.local();
    }
    const multiDay = !visibleEnd.isSame(startLocal, 'day');

    const asISOString = `${startUTC.toISOString()}/${endUTC.toISOString()}`;
    const asString = (
      `${startLocal.format(constants.TIME_FORMAT)}\u2013` +
      `${visibleEnd.format(multiDay ? constants.TIME_FORMAT_WEEKDAY : constants.TIME_FORMAT)}`
    );

    const slotRange = moment.range(startLocal, endLocal);
    const editing = editRanges.some(
      editRange => editRange.overlaps(slotRange)
    );

    let reserved = false;
    let reservation = null;
    let reservationStarting = false;
    let reservationEnding = false;
    forEach(reservationRanges, (reservationRange, index) => {
      if (reservationRange.overlaps(slotRange)) {
        reserved = true;
        reservation = reservations[index];
        const [reservationStart, reservationEnd] = reservationRange.toDate();
        const [slotStart, slotEnd] = slotRange.toDate();
        reservationStarting = reservationStart.getTime() === slotStart.getTime();
        reservationEnding = reservationEnd.getTime() === slotEnd.getTime();
      }
    });

    let reservable = reserved || reservationsAllowed;
    if ((reservableBeforeUTC && startUTC >= reservableBeforeUTC) ||
        (reservableAfterUTC && startUTC < reservableAfterUTC)) {
      reservable = false;
    }

    slots.push({
      asISOString,
      asString,
      editing,
      reservable,
      reservation,
      reservationStarting,
      reservationEnding,
      reserved,
      start: startUTC.toISOString(),
      end: endUTC.toISOString(),
    });
  }, true);

  return slots;
}

export {
  addToDate,
  getDateStartAndEndTimes,
  getDateString,
  getStartAndEndMoments,
  getStartAndEndOfReservations,
  getStartAndEndTimes,
  getTimeSlots,
};
