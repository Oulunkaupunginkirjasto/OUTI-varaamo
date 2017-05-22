import { createSelector } from 'reselect';
import { getStartAndEndMoments } from 'utils/TimeUtils';

import dateSelector from 'selectors/dateSelector';

const fetchDatesSelector = createSelector(
  dateSelector,
  (date) => getStartAndEndMoments(date),
);

export default fetchDatesSelector;
