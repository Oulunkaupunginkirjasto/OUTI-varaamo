import Immutable from 'seamless-immutable';

const initialState = Immutable({
  clientKey: null,
  config: null,
});

function clientConfigurationReducer(state = initialState, action) {
  switch (action.type) {

    default: {
      return state;
    }
  }
}

export default clientConfigurationReducer;
