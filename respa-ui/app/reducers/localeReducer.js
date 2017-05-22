import Immutable from 'seamless-immutable';

import constants from 'constants/AppConstants';
import types from 'constants/ActionTypes';

const initialState = Immutable({
  locale: constants.DEFAULT_LOCALE,
});

function localeReducer(state = initialState, action) {
  let locale;
  switch (action.type) {

    case types.UI.CHANGE_LOCALE: {
      locale = action.payload;
      return state.set('locale', locale);
    }

    default: {
      return state;
    }
  }
}

export default localeReducer;
