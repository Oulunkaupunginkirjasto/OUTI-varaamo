import sortBy from 'lodash/sortBy';
import { createSelector } from 'reselect';

import localeSelector from 'selectors/localeSelector';
import { getName } from 'utils/DataUtils';

const resourcesSelector = (state) => state.data.resources;
const resultsSelector = (state) => state.ui.search.results;

const searchResultsSelector = createSelector(
  localeSelector,
  resourcesSelector,
  resultsSelector,
  (locale, resources, results) => {
    const searchResults = sortBy(
      results.map(resourceId => resources[resourceId]),
      (result) => getName(result, locale)
    );

    return searchResults;
  }
);

export default searchResultsSelector;
