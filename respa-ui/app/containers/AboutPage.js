import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { defineMessages, injectIntl, intlShape } from 'react-intl';

import AboutPageContent from 'components/customization/AboutPageContent';

const messages = defineMessages({
  title: {
    id: 'about.title',
    defaultMessage: 'Tietoa palvelusta - Varaamo',
  },
});

class AboutPage extends Component {
  render() {
    const { intl } = this.props;
    return (
      <DocumentTitle title={intl.formatMessage(messages.title)}>
        <div className="about-page">
          <AboutPageContent />
        </div>
      </DocumentTitle>
    );
  }
}

AboutPage.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(AboutPage);
