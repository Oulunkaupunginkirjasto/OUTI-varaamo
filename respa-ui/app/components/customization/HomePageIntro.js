import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';

import constants from 'constants/AppConstants';
import { getCurrentCustomization } from 'utils/CustomizationUtils';

class HomePageIntro extends Component {
  render() {
    const locale = this.props.intl.locale;
    switch (getCurrentCustomization()) {

      case 'OULU': {
        switch (locale) {
          case constants.LOCALES.english: {
            return (
              <div>
                <h2>Reserve the library's equipment, rooms and services</h2>
                <p>
                  You can see the reservation availability without logging in.
                  Reservation requires logging in with an OUTI library card and PIN.
                </p>
              </div>
            );
          }
          default: {
            return (
              <div>
                <h2>Varaa kirjaston laitteita, tiloja ja palveluja</h2>
                <p>
                  Varaustilanteen näet kirjautumatta.
                  Varaaminen edellyttää kirjautumista OUTI-kirjastokortilla ja salanumerolla.
                </p>
              </div>
            );
          }
        }
      }

      case 'ESPOO': {
        return (
          <div>
            <h2>Varaa vaivatta kaupungin tiloja ja laitteita</h2>
            <p>
              Varaustilanteen näet kirjautumatta. Varaaminen edellyttää kirjautumista.
              Kyseessä on kokeiluasteella oleva palvelu, jonka kautta varataan Espoon
              kaupunginkirjaston sekä Helsingin kaupungin tarjoamia tiloja ja työpisteitä.
            </p>
          </div>
        );
      }

      default: {
        return (
          <div>
            <h2>Varaa vaivatta kaupungin tiloja ja laitteita</h2>
            <p>
              Varaustilanteen näet kirjautumatta. Varaaminen edellyttää kirjautumista. Kyseessä on
              kokeiluasteella oleva palvelu, jonka kautta varataan kaupunginkirjaston,
              nuorisoasiainkeskuksen ja varhaiskasvatusviraston tiloja ja työpisteitä.
            </p>
          </div>
        );
      }
    }
  }
}

HomePageIntro.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(HomePageIntro);
