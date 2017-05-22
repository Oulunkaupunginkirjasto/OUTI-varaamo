import sortBy from 'lodash/sortBy';
import values from 'lodash/values';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import localeSelector from 'selectors/localeSelector';
import { getName } from 'utils/DataUtils';

const purposesSelector = (state) => state.data.purposes;

const purposeOptionsSelector = createSelector(
  localeSelector,
  purposesSelector,
  (locale, purposes) => {
    const purposeOptions = values(purposes)
      .filter((purpose) => purpose.parent !== null)
      .map(purpose => ({
        value: purpose.id,
        label: getName(purpose, locale),
      }));
    const alphabetized = sortBy(purposeOptions, 'label');

    return Immutable(alphabetized);
  }
);

export default purposeOptionsSelector;
