import sortBy from 'lodash/sortBy';
import values from 'lodash/values';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import localeSelector from 'selectors/localeSelector';
import { getName } from 'utils/DataUtils';

const unitsSelector = (state) => state.data.units;

const unitOptionsSelector = createSelector(
  localeSelector,
  unitsSelector,
  (locale, units) => {
    const unitOptions = values(units)
      .map(unit => ({
        value: unit.id,
        label: getName(unit, locale),
      }));
    const alphabetized = sortBy(unitOptions, 'label');

    return Immutable(alphabetized);
  }
);

export default unitOptionsSelector;
