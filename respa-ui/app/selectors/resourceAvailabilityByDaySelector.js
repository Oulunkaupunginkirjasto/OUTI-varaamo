import moment from 'moment';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import constants from 'constants/AppConstants';
import fetchDatesSelector from 'selectors/fetchDatesSelector';
import resourceSelector from 'selectors/resourceSelector';
import { getAvailableTime, getOpeningHours, hasReservableTime } from 'utils/DataUtils';

const searchResultAvailabilityByDaySelector = createSelector(
  fetchDatesSelector,
  resourceSelector,
  (dates, resource) => {
    const days = {};
    const today = moment().startOf('day');
    const range = moment.range(moment(dates.startMoment), moment(dates.endMoment));
    range.by(moment.duration(1, 'days'), (date) => {
      const dateString = date.format(constants.DATE_FORMAT);
      if (date.isBefore(today) || !hasReservableTime(getOpeningHours(resource, dateString),
          resource.reservableBefore, resource.reservableAfter)) {
        days[dateString] = constants.DAY_AVAILABILITY.noTimes;
      } else {
        const availableTime = getAvailableTime(getOpeningHours(resource, dateString),
          resource.reservations, resource.reservableBefore, resource.reservableAfter);
        if (availableTime !== 0) {
          days[dateString] = constants.DAY_AVAILABILITY.available;
        } else {
          days[dateString] = constants.DAY_AVAILABILITY.allReserved;
        }
      }
    });

    return Immutable(days);
  }
);

export default searchResultAvailabilityByDaySelector;
