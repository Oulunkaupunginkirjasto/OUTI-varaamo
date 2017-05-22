import Immutable from 'seamless-immutable';
import jwtDecode from 'jwt-decode';

import types from 'constants/ActionTypes';

const initialState = Immutable({
  token: null,
  userId: null,
});

function authReducer(state = initialState, action) {
  switch (action.type) {

    case types.API.RESERVATION_DELETE_ERROR:
    case types.API.RESERVATION_PUT_ERROR:
    case types.API.RESERVATION_POST_ERROR: {
      if (action.payload.status === 401) {
        window.localStorage.removeItem('varaamoAuthToken');
        window.localStorage.removeItem('varaamoUserId');
        return initialState;
      }
      return state;
    }

    case types.API.LOGIN_POST_SUCCESS: {
      if (action.payload.token) {
        const decoded = jwtDecode(action.payload.token);
        window.localStorage.setItem('varaamoAuthToken', action.payload.token);
        window.localStorage.setItem('varaamoUserId', decoded.uuid.toString());
        return state.merge({
          userId: decoded.uuid.toString(),
          token: action.payload.token,
        });
      }
      return state;
    }

    case types.UI.LOGOUT: {
      window.localStorage.removeItem('varaamoAuthToken');
      window.localStorage.removeItem('varaamoUserId');
      return initialState;
    }

    default: {
      return state;
    }
  }
}

export default authReducer;
