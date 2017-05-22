import React, { Component } from 'react';
import Well from 'react-bootstrap/lib/Well';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';

import constants from 'constants/AppConstants';
import { getSearchPageUrl } from 'utils/SearchUtils';

const messages = defineMessages({
  title: {
    id: 'notfound.title',
    defaultMessage: '404 Sivua ei löydy - Varaamo',
  },
});

class NotFoundPage extends Component {
  render() {
    const { intl } = this.props;
    let content;
    switch (intl.locale) {
      case constants.LOCALES.english:
        content = (
          <div>
            <h1>404 Page not Found</h1>
            <p className="lead">
              <strong>Sorry!</strong> Looks like this page does not exist.
            </p>
            <Well>
              <h5>You can try the following:</h5>
              <ul>
                <li>
                  If you were looking for a particular room, you can search for it on
                  the <Link to={getSearchPageUrl()}>search page</Link>.
                </li>
                <li>If you entered the address by hand, check that it is correct.</li>
                <li>
                  If you came to this page from some other part of our site,
                  please contact us so we can fix the problem.
                </li>
              </ul>
            </Well>
          </div>
        );
        break;
      default:
        content = (
          <div>
            <h1>404 Sivua ei löydy</h1>
            <p className="lead">
              <strong>Pahoittelut!</strong> Näyttää siltä, että tätä sivua ei ole olemassa.
            </p>
            <Well>
              <h5>Voit yrittää seuraavaa:</h5>
              <ul>
                <li>
                  Jos etsit jotain tiettyä tilaa, voit etsiä
                  sitä <Link to={getSearchPageUrl()}>hakusivulta</Link>.
                </li>
                <li>Jos syötit sivun osoitteen käsin, tarkista että se on oikein.</li>
                <li>
                  Jos tulit tälle sivulle jostain toisesta sivustomme osasta,
                  ota meihin yhteyttä, jotta voimme korjata virheen.
                </li>
              </ul>
            </Well>
          </div>
        );
        break;
    }
    return (
      <DocumentTitle title={intl.formatMessage(messages.title)}>
        {content}
      </DocumentTitle>
    );
  }
}

NotFoundPage.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(NotFoundPage);
