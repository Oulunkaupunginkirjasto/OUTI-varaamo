import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import isLoggedInSelector from 'selectors/isLoggedInSelector';
import passwordRequiredForLoginSelector from 'selectors/passwordRequiredForLoginSelector';
import modalIsOpenSelectorFactory from 'selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';


const loginModalSelector = createSelector(
  isLoggedInSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.LOGIN_POST_REQUEST),
  passwordRequiredForLoginSelector,
  modalIsOpenSelectorFactory(ModalTypes.LOGIN),
  (
    isLoggedIn,
    isLoggingIn,
    passwordRequired,
    show
  ) => ({
    isLoggedIn,
    isLoggingIn,
    passwordRequired,
    show,
  })
);

export default loginModalSelector;
