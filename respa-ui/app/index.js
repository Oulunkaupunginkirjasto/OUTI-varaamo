import 'location-origin';

import createHistory from 'history/lib/createBrowserHistory';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import React from 'react';
import { render } from 'react-dom';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fi from 'react-intl/locale-data/fi';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createStore } from 'redux';
import { syncReduxAndRouter } from 'redux-simple-router';
import Immutable from 'seamless-immutable';

import IntlProvider from 'app/components/common/IntlProvider';
import getRoutes from 'app/routes';
import rootReducer from 'reducers/index';
import configureStore from 'store/configureStore';

import 'assets/styles/app.less';
import 'assets/styles/customization/espoo/customization.less';
import 'assets/styles/customization/oulu/customization.less';

function runApp() {
  addLocaleData([...en, ...fi]);
  const initialStoreState = createStore(rootReducer, {}).getState();
  const initialState = window.INITIAL_STATE;
  const clientKey = window.localStorage.getItem('varaamoClientKey');
  const authToken = window.localStorage.getItem('varaamoAuthToken');
  const userId = window.localStorage.getItem('varaamoUserId');
  let finalState = Immutable(initialStoreState).merge(initialState, { deep: true });
  if (clientKey) {
    finalState = finalState.merge({ client: { clientKey } });
  }
  if (authToken && userId) {
    try {
      const decoded = jwtDecode(authToken);
      const expMoment = moment.unix(decoded.exp);
      const soonMoment = moment().add(1, 'minutes');
      if (expMoment > soonMoment) {
        finalState = finalState.merge({ auth: { token: authToken, userId } }, { deep: true });
      } else {
        window.localStorage.removeItem('varaamoAuthToken');
        window.localStorage.removeItem('varaamoUserId');
      }
    } catch (e) {
      window.localStorage.removeItem('varaamoAuthToken');
      window.localStorage.removeItem('varaamoUserId');
    }
  }
  const store = configureStore(finalState);
  const history = createHistory();

  syncReduxAndRouter(history, store);

  render(
    <Provider store={store}>
      <IntlProvider>
        <Router history={history}>
          {getRoutes(store)}
        </Router>
      </IntlProvider>
    </Provider>,
    document.getElementById('root')
  );

  if (__DEVTOOLS__) {
    require('./createDevToolsWindow')(store); // eslint-disable-line global-require
  }
}

// Polyfill
if (!global.Intl) {
  require.ensure([
    'intl',
    'intl/locale-data/jsonp/en',
    'intl/locale-data/jsonp/fi',
  ], (require) => {
    require('intl');
    require('intl/locale-data/jsonp/en');
    require('intl/locale-data/jsonp/fi');

    runApp();
  });
} else {
  runApp();
}
