import forEach from 'lodash/forEach';
import moment from 'moment';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import constants from 'constants/AppConstants';
import fetchDatesSelector from 'selectors/fetchDatesSelector';
import searchResultsSelector from 'selectors/searchResultsSelector';
import { getAvailableTime, getOpeningHours } from 'utils/DataUtils';

const searchResultAvailabilityByDaySelector = createSelector(
  fetchDatesSelector,
  searchResultsSelector,
  (dates, results) => {
    const days = {};
    const today = moment().startOf('day');
    const range = moment.range(moment(dates.startMoment), moment(dates.endMoment));
    range.by(moment.duration(1, 'days'), (date) => {
      const dateString = date.format(constants.DATE_FORMAT);
      if (date.isBefore(today)) {
        days[dateString] = constants.DAY_AVAILABILITY.noTimes;
      } else {
        days[dateString] = constants.DAY_AVAILABILITY.allReserved;
      }
    });
    forEach(results, (result) => {
      range.by(moment.duration(1, 'days'), (date) => {
        const dateString = date.format(constants.DATE_FORMAT);
        const availableTime = getAvailableTime(getOpeningHours(result, dateString),
          result.reservations, result.reservableBefore, result.reservableAfter);
        if (availableTime !== 0) {
          days[dateString] = constants.DAY_AVAILABILITY.available;
        }
      });
    });
    return Immutable(days);
  }
);

export default searchResultAvailabilityByDaySelector;
