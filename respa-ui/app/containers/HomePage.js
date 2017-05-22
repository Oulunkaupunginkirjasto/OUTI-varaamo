import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';

import HomePageIntro from 'components/customization/HomePageIntro';
import PurposeCategoryList from 'containers/PurposeCategoryList';

const messages = defineMessages({
  title: {
    id: 'home.title',
    defaultMessage: 'Etusivu - Varaamo',
  },
});

class HomePage extends Component {
  render() {
    const { intl } = this.props;
    return (
      <DocumentTitle title={intl.formatMessage(messages.title)}>
        <div>
          <HomePageIntro />
          <h2 id="purpose-category-header">
            <FormattedMessage
              id="home.what_purpose"
              defaultMessage="Mitä haluat tehdä?"
            />
          </h2>
          <PurposeCategoryList />
        </div>
      </DocumentTitle>
    );
  }
}

HomePage.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(HomePage);
