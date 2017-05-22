import camelCase from 'lodash/camelCase';
import capitalize from 'lodash/capitalize';
import clone from 'lodash/clone';
import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';
import tail from 'lodash/tail';
import moment from 'moment';

import constants from 'constants/AppConstants';

function combineReservations(reservations) {
  if (!reservations || !reservations.length) {
    return [];
  }

  const sorted = sortBy(reservations, 'begin');
  const initialValue = [clone(sorted[0])];

  return tail(sorted).reduce((previous, current) => {
    if (current.begin === last(previous).end) {
      last(previous).end = current.end;
    } else {
      previous.push(clone(current));
    }
    return previous;
  }, initialValue);
}

function isStaffEvent(reservation, resource) {
  if (!resource || !resource.requiredReservationExtraFields) {
    return false;
  }
  return some(resource.requiredReservationExtraFields, (field) => (
    !reservation[camelCase(field)]
  ));
}

function getAddress(item) {
  if (!item || isEmpty(item)) {
    return '';
  }

  const streetAddress = item.streetAddress ? item.streetAddress.fi : '';
  const zip = item.addressZip;
  const city = capitalize(item.municipality);

  return `${streetAddress}, ${zip} ${city}`;
}

function getAddressWithName(item, language = 'fi') {
  const parts = [
    getName(item, language),
    getAddress(item),
  ];

  return filter(parts, part => part !== '').join(', ');
}

function getAvailableTime(openingHours = {}, reservations = [], reservableBefore, reservableAfter) {
  const { closes, opens } = openingHours;

  if (!closes || !opens) {
    return 0;
  }

  const nowMoment = moment();
  const opensMoment = moment(opens);
  const closesMoment = moment(closes);

  if (nowMoment > closesMoment) {
    return 0;
  }

  let reservableBeforeUTC = null;
  if (reservableBefore) {
    reservableBeforeUTC = moment.utc(reservableBefore);
  }
  let reservableAfterUTC = null;
  if (reservableAfter) {
    reservableAfterUTC = moment.utc(reservableAfter);
  }

  if ((reservableAfterUTC && opensMoment < reservableAfterUTC) ||
      (reservableBeforeUTC && closesMoment >= reservableBeforeUTC)) {
    return 0;
  }

  const beginMoment = nowMoment > opensMoment ? nowMoment : opensMoment;
  let total = closesMoment - beginMoment;

  forEach(
    filter(reservations, reservation => (
      reservation.state !== 'cancelled' && moment(reservation.end) > nowMoment
      && moment(reservation.begin).isSameOrBefore(closesMoment)
      && moment(reservation.end).isSameOrAfter(opensMoment)
    )),
    (reservation) => {
      const resBeginMoment = moment(reservation.begin);
      const resEndMoment = moment(reservation.end);
      const maxBeginMoment = nowMoment > resBeginMoment ? nowMoment : resBeginMoment;
      total = (total - resEndMoment) + maxBeginMoment;
    }
  );

  const asHours = moment.duration(total).asHours();
  const rounded = Math.ceil(asHours * 2) / 2;

  return rounded >= 0 ? rounded : 0;
}

function getCaption(item, language = 'fi') {
  return getTranslatedProperty(item, 'caption', language);
}

function getDescription(item, language = 'fi') {
  return getTranslatedProperty(item, 'description', language);
}

function getMainImage(images) {
  if (!images || !images.length) {
    return {};
  }

  return find(images, { type: 'main' }) || images[0];
}

function getMissingReservationValues(reservation) {
  const missingValues = {};
  constants.REQUIRED_STAFF_EVENT_FIELDS.forEach((field) => {
    if (!reservation[field]) {
      missingValues[field] = '-';
    }
  });
  return missingValues;
}

function getName(item, language) {
  return getTranslatedProperty(item, 'name', language);
}

function getOpeningHours(item, date) {
  if (item && item.openingHours && item.openingHours.length) {
    let openingHours = filter(item.openingHours, (hours) => (hours.date === date));
    if (!date || !openingHours.length) {
      openingHours = item.openingHours;
    }
    return {
      closes: openingHours[0].closes,
      opens: openingHours[0].opens,
    };
  }

  return {};
}

function getPeopleCapacityString(capacity) {
  if (!capacity) {
    return '';
  }
  return `max ${capacity} hengelle.`;
}

function getTranslatedProperty(item, property, language = 'fi') {
  if (item && item[property] && item[property][language]) {
    return item[property][language];
  }
  if (item && item[property] && item[property][constants.DEFAULT_LOCALE]) {
    return item[property][constants.DEFAULT_LOCALE];
  }
  return '';
}

function hasReservableTime(openingHours = {}, reservableBefore, reservableAfter) {
  const { closes, opens } = openingHours;

  if (!closes || !opens) {
    return 0;
  }

  const nowMoment = moment();
  const opensMoment = moment(opens);
  const closesMoment = moment(closes);

  if (nowMoment > closesMoment) {
    return 0;
  }

  let reservableBeforeUTC = null;
  if (reservableBefore) {
    reservableBeforeUTC = moment.utc(reservableBefore);
  }
  let reservableAfterUTC = null;
  if (reservableAfter) {
    reservableAfterUTC = moment.utc(reservableAfter);
  }

  if ((reservableAfterUTC && opensMoment < reservableAfterUTC) ||
      (reservableBeforeUTC && closesMoment >= reservableBeforeUTC)) {
    return false;
  }

  const beginMoment = nowMoment > opensMoment ? nowMoment : opensMoment;
  const total = closesMoment - beginMoment;

  const asHours = moment.duration(total).asHours();
  const rounded = Math.ceil(asHours * 2) / 2;

  return rounded >= 0;
}

export {
  combineReservations,
  isStaffEvent,
  getAddress,
  getAddressWithName,
  getAvailableTime,
  getCaption,
  getDescription,
  getMainImage,
  getMissingReservationValues,
  getName,
  getOpeningHours,
  getPeopleCapacityString,
  getTranslatedProperty,
  hasReservableTime,
};
