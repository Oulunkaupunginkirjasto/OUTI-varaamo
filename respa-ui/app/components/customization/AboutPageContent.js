import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';

import FeedbackLink from 'components/customization/FeedbackLink';
import constants from 'constants/AppConstants';
import { getCurrentCustomization } from 'utils/CustomizationUtils';

class AboutPageContent extends Component {
  render() {
    const { intl } = this.props;
    const locale = intl.locale;
    let registerLink;

    switch (getCurrentCustomization()) {

      case 'OULU': {
        switch (locale) {
          case constants.LOCALES.english: {
            registerLink = (
              // eslint-disable-next-line max-len
              <a href="https://www.ouka.fi/documents/78400/0/varaamon_asiakasrekisteriseloste_muok.doc/0b2e6f1b-cc0f-478b-820f-03fcccd49d5f">
                here
              </a>
            );

            return (
              <div>
                <h1>About the VARAAMO service</h1>
                <p className="lead"> VARAAMO is a service maintained by the Oulu City library.
                  You can reserve equipment, rooms and services.
                </p>
                <p>
                  Use of equipment, rooms and services in the VARAAMO service is free.
                  OUTI library card and PIN are used in the service.
                  Our privacy policy can be found {registerLink}.
                </p>
                <p>
                  The service is based on the open <a href="http://dev.hel.fi/apis/respa">room
                  reservation API </a> developed by the city of Helsinki. The API has been
                  implemented as a part of the <a href="http://6aika.fi">6aika</a> project.
                  The library of Oulu's VARAAMO service is implemented by Visualligent Oy.
                </p>
                <p>
                  The service is still under development.
                  The library accepts <a href="mailto:info.kirjasto@ouka.fi">
                  feedback</a> about the service.
                </p>
              </div>
            );
          }

          default: {
            registerLink = (
              // eslint-disable-next-line max-len
              <a href="https://www.ouka.fi/documents/78400/0/varaamon_asiakasrekisteriseloste_muok.doc/0b2e6f1b-cc0f-478b-820f-03fcccd49d5f">
                täältä
              </a>
            );

            return (
              <div>
                <h1>Tietoa VARAAMO-palvelusta</h1>
                <p className="lead"> VARAAMO on Oulun kaupunginkirjaston ylläpitämä palvelu,
                  jossa voi varata kirjaston laitteita, tiloja ja palveluita.
                </p>
                <p>
                  VARAAMO-palvelun laitteiden, tilojen ja palvelujen käyttö on maksutonta.
                  Palvelussa käytetään OUTI-kirjastokorttia ja salanumeroa.
                  Palvelun rekisteriseloste löytyy {registerLink}.
                </p>
                <p>
                  Palvelu perustuu Helsingin kaupungin kehittämään
                  avoimeen <a href="http://dev.hel.fi/apis/respa">tilavarausrajapintaan</a>,
                  joka on toteutettu osana Suomen suurimpien kaupunkien
                  yhteistä <a href="http://6aika.fi">6aika - Avoimet ja älykkäät
                  palvelut</a> -hanketta. Oulun kaupunginkirjaston VARAAMO-palvelun toteuttaja
                  on oululainen Visualligent Oy.
                </p>
                <p>
                  Palvelua kehitetään edelleen.
                  Kirjasto ottaa mielellään vastaan <a href="mailto:info.kirjasto@ouka.fi">
                  palautetta</a> palvelun toteuttamisesta.
                </p>
              </div>
            );
          }
        }
      }

      case 'ESPOO': {
        registerLink = (
          <a href="http://www.helmet-kirjasto.fi/varaamo-palaute/rekisteriseloste.php">
            Asiakasrekisteriseloste
          </a>
        );

        return (
          <div>
            <h1>Tietoa varaamo.espoo.fi –palvelusta</h1>
            <p className="lead">
              Varaamo on Helsingin kaupungin ylläpitämä verkkopalvelu, jonka kautta voi varata
              Espoon ja Helsingin kaupunkien julkisia tiloja sekä työpisteitä yksityiseen käyttöön.
            </p>
            <p>
              Tilavarausjärjestelmä on testausvaiheessa, eikä pilottikäytössä olevassa versiossa ole
              vielä kaikkia suunnitteilla olevia ominaisuuksia ja toiminnallisuuksia.
            </p>
            <p>
              Pilottivaiheessa palvelun kautta on varattavissa Espoon Ison Omenan Palvelutorin
              (kirjasto, terveysasema, neuvola) sekä Helsingin kaupunginkirjaston,
              nuorisoasiainkeskuksen sekä varhaiskasvatusviraston tiloja, työpisteitä ja laitteita.
            </p>
            <p>
              Varaamo perustuu Helsingin kaupungin avoimeen <a href="http://dev.hel.fi/apis/respa">
              tilavarausrajapintaan</a>, joka on toteutettu osana Suomen suurimpien kaupunkien
              yhteistä <a href="http://6aika.fi">6aika - Avoimet ja älykkäät palvelut</a> -hanketta.
            </p>
            <p>
              Varaamo-tilavarausjärjestelmän kehittäminen on osa Helsingin kaupungin
              strategiaohjelmaa 2013 - 2016 (Tehokkaat ja toimivat tukipalvelut) sekä
              tietotekniikkaohjelmaa 2015 - 2017 (Datarajapinnat ja avoin kaupunkikehitys).
            </p>
            <p>
              Virastoyhteisen tilavaraushankkeen tavoitteena on julkisten tilojen käytön
              tehostaminen, saavutettavuuden parantaminen ja tilojen käyttöön liittyvien
              kustannusten alentaminen kaupungin tilavarauskäytäntöjä yhtenäistämällä.
            </p>
            <p>
              Palvelua kehitetään edelleen ja toivomme palvelun käyttäjiltä palautetta. Palautetta
              voit antaa <FeedbackLink text="tämän linkin" /> kautta.
            </p>
            <h3>Asiakasrekisteriseloste</h3>
            <p>
              Palveluun liittyvän asiakasreskisteriselosteen näet täältä: {registerLink}
            </p>
          </div>
        );
      }

      default: {
        registerLink = (
          <a href="http://www.helmet-kirjasto.fi/varaamo-palaute/rekisteriseloste.php">
            Asiakasrekisteriseloste
          </a>
        );

        return (
          <div>
            <h1>Tietoa varaamo.hel.fi –palvelusta</h1>
            <p className="lead">
              Varaamo on Helsingin kaupungin ylläpitämä verkkopalvelu, jonka kautta voi varata
              kaupungin julkisia tiloja sekä työpisteitä yksityiseen käyttöön.
            </p>
            <p>
              Tilavarausjärjestelmä on testausvaiheessa, eikä pilottikäytössä olevassa versiossa ole
              vielä kaikkia suunnitteilla olevia ominaisuuksia ja toiminnallisuuksia.
            </p>
            <p>
              Pilottivaiheessa palvelun kautta on varattavissa kaupunginkirjaston,
              nuorisoasiainkeskuksen sekä varhaiskasvatusviraston tiloja, työpisteitä ja laitteita.
            </p>
            <p>
              Varaamo perustuu Helsingin kaupungin avoimeen <a href="http://dev.hel.fi/apis/respa">
              tilavarausrajapintaan</a>, joka on toteutettu osana Suomen suurimpien kaupunkien
              yhteistä <a href="http://6aika.fi">6aika - Avoimet ja älykkäät palvelut</a> -hanketta.
            </p>
            <p>
              Varaamo-tilavarausjärjestelmän kehittäminen on osa Helsingin kaupungin
              strategiaohjelmaa 2013 - 2016 (Tehokkaat ja toimivat tukipalvelut) sekä
              tietotekniikkaohjelmaa 2015 - 2017 (Datarajapinnat ja avoin kaupunkikehitys).
            </p>
            <p>
              Virastoyhteisen tilavaraushankkeen tavoitteena on julkisten tilojen käytön
              tehostaminen, saavutettavuuden parantaminen ja tilojen käyttöön liittyvien
              kustannusten alentaminen kaupungin tilavarauskäytäntöjä yhtenäistämällä.
            </p>
            <p>
              Palvelua kehitetään edelleen ja toivomme palvelun käyttäjiltä palautetta. Palautetta
              voit antaa <FeedbackLink text="tämän linkin" /> kautta.
            </p>
            <h3>Asiakasrekisteriseloste</h3>
            <p>
              Palveluun liittyvän asiakasreskisteriselosteen näet täältä: {registerLink}
            </p>
          </div>
        );
      }
    }
  }
}

AboutPageContent.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(AboutPageContent);
