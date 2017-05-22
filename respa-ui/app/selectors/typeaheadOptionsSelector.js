import { createSelector } from 'reselect';

import { getName } from 'utils/DataUtils';

const typeaheadSuggestionsSelector = (state) => state.ui.search.typeaheadSuggestions;
const unitsSelector = (state) => state.data.units;

const typeaheadOptionsSelector = createSelector(
  typeaheadSuggestionsSelector,
  unitsSelector,
  (typeaheadSuggestions, units) => (
    typeaheadSuggestions.map((suggestion) => ({
      id: suggestion.id,
      name: getName(suggestion),
      unitName: getName(units[suggestion.unit]),
    }))
  )
);

export default typeaheadOptionsSelector;
