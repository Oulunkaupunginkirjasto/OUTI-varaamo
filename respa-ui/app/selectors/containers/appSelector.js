import { createSelector } from 'reselect';

import currentUserSelector from 'selectors/currentUserSelector';
import isLoggedInSelector from 'selectors/isLoggedInSelector';
import localeSelector from 'selectors/localeSelector';

const userIdSelector = (state) => state.auth.userId;

const appSelector = createSelector(
  isLoggedInSelector,
  localeSelector,
  currentUserSelector,
  userIdSelector,
  (
    isLoggedIn,
    locale,
    user,
    userId
  ) => ({
    isLoggedIn,
    locale,
    user,
    userId,
  })
);

export default appSelector;
