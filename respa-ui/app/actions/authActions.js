import { createAction } from 'redux-actions';
import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/APIUtils';

const logout = createAction(types.UI.LOGOUT);

function postLogin(params = {}) {
  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.LOGIN_POST_REQUEST),
        getSuccessTypeDescriptor(types.API.LOGIN_POST_SUCCESS),
        getErrorTypeDescriptor(types.API.LOGIN_POST_ERROR),
      ],
      endpoint: buildAPIUrl('authtoken'),
      method: 'POST',
      headers: getHeadersCreator(),
      body: JSON.stringify({
        username: params.username,
        password: params.password,
      }),
    },
  };
}

export {
  logout,
  postLogin,
};
