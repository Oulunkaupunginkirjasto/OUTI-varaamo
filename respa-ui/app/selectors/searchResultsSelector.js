import { createSelector } from 'reselect';

const resourcesSelector = (state) => state.data.resources;
const resultsSelector = (state) => state.ui.search.results;

const searchResultsSelector = createSelector(
  resourcesSelector,
  resultsSelector,
  (resources, results) => results.map(resourceId => resources[resourceId])
);

export default searchResultsSelector;
