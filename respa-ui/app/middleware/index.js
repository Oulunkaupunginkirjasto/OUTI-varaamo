/* eslint-disable global-require */
import { applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import createLogger from 'redux-logger';

import tracking from 'middleware/tracking';

const isDevelopment = process.env.NODE_ENV !== 'production';
const storeEnhancers = [applyMiddleware(apiMiddleware), applyMiddleware(tracking)];

if (isDevelopment) {
  // /* eslint-disable no-console */
  // const originalConsoleError = console.error;
  // if (console.error === originalConsoleError) {
  //   console.error = (...args) => {
  //     if (args[0].indexOf('[React Intl] Missing message:') === 0 &&
  //         args[0].indexOf('locale: "fi"') !== -1) {
  //       return;
  //     }
  //     originalConsoleError.call(console, ...args);
  //   };
  // }
  // /* eslint-enable no-console */
  const loggerMiddleware = createLogger({
    collapsed: true,
    duration: true,
  });
  storeEnhancers.push(applyMiddleware(loggerMiddleware));
  if (__DEVTOOLS__) {
    const { devTools, persistState } = require('redux-devtools');

    storeEnhancers.push(devTools());
    storeEnhancers.push(persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)));
  }
}

export default storeEnhancers;
