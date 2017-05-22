import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IntlProvider as ReactIntlProvider } from 'react-intl';

import constants from 'constants/AppConstants';
import intlProviderSelector from 'selectors/intlProviderSelector';

class UnconnectedIntlProvider extends Component {
  render() {
    const {
      children,
      locale,
      messages,
    } = this.props;
    return (
      <ReactIntlProvider
        defaultLocale={constants.DEFAULT_LOCALE}
        key={locale}
        locale={locale}
        messages={messages}
      >
        {children}
      </ReactIntlProvider>
    );
  }
}

UnconnectedIntlProvider.propTypes = {
  children: PropTypes.element.isRequired,
  locale: PropTypes.string.isRequired,
  messages: PropTypes.object.isRequired,
};


export default connect(intlProviderSelector)(UnconnectedIntlProvider);
