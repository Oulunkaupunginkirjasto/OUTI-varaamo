/* eslint-disable global-require */
import { compose, createStore } from 'redux';

import middleware from 'middleware';
import rootReducer from 'reducers/index';

const finalCreateStore = compose(...middleware)(createStore);

function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('reducers', () => {
      const nextRootReducer = require('reducers/index');

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

export default configureStore;
