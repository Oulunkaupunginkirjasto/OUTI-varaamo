import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import fetchDatesSelector from 'selectors/fetchDatesSelector';
import purposeOptionsSelector from 'selectors/purposeOptionsSelector';
import searchResultAvailabilityByDaySelector from 'selectors/searchResultAvailabilityByDaySelector';
import uiSearchFiltersSelector from 'selectors/uiSearchFiltersSelector';
import unitOptionsSelector from 'selectors/unitOptionsSelector';
import urlSearchFiltersSelector from 'selectors/urlSearchFiltersSelector';
import typeaheadOptionsSelector from 'selectors/typeaheadOptionsSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const searchControlsSelector = createSelector(
  fetchDatesSelector,
  purposeOptionsSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.PURPOSES_GET_REQUEST),
  requestIsActiveSelectorFactory(ActionTypes.API.UNITS_GET_REQUEST),
  searchResultAvailabilityByDaySelector,
  typeaheadOptionsSelector,
  uiSearchFiltersSelector,
  unitOptionsSelector,
  urlSearchFiltersSelector,
  (
    fetchDates,
    purposeOptions,
    isFetchingPurposes,
    isFetchingUnits,
    calendarAvailability,
    typeaheadOptions,
    uiSearchFilters,
    unitOptions,
    urlSearchFilters
  ) => ({
    calendarAvailability,
    isFetchingPurposes,
    isFetchingUnits,
    fetchDates,
    filters: uiSearchFilters,
    purposeOptions,
    typeaheadOptions,
    unitOptions,
    urlSearchFilters,
  })
);

export default searchControlsSelector;
