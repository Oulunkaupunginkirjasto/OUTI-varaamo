import React, { Component } from 'react';

import { getCurrentCustomization } from 'utils/CustomizationUtils';

import helsinkiLogoSrc from 'assets/images/helsinki-coat-of-arms-white.png';
import espooLogoSrc from 'assets/images/espoo-logo.png';
import ouluLogoSrc from 'assets/images/oulu_logo_kirjasto.png';

class Logo extends Component {
  render() {
    switch (getCurrentCustomization()) {

      case 'ESPOO': {
        return (
          <img
            alt="Espoon kaupunki"
            src={espooLogoSrc}
          />
        );
      }

      case 'OULU': {
        return (
          <img
            alt="Oulun kaupunginkirjasto"
            src={ouluLogoSrc}
          />
        );
      }

      default: {
        return (
          <img
            alt="Helsingin vaakuna"
            src={helsinkiLogoSrc}
          />
        );
      }
    }
  }
}

Logo.propTypes = {};

export default Logo;
