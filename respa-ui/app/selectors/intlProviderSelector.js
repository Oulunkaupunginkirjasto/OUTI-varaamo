import constants from 'constants/AppConstants';
import en from 'messages/en';

const intlProviderSelector = (state) => {
  const locale = state.ui.locale.locale;
  let messages = {};
  switch (locale) {
    case constants.LOCALES.english:
      messages = en;
      break;
    default:
      messages = {};
  }
  return {
    locale,
    messages,
  };
};

export default intlProviderSelector;
