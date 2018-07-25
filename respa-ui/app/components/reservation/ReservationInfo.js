import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Well from 'react-bootstrap/lib/Well';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import WrappedText from 'components/common/WrappedText';
import { getTranslatedProperty } from 'utils/DataUtils';

class ReservationInfo extends Component {
  renderLoginText(isLoggedIn, resource) {
    if (isLoggedIn || !resource.reservable) {
      return null;
    }
    return (
      <p>
        <FormattedMessage
          id="reservation_info.login_required"
          defaultMessage="Sinun täytyy kirjautua sisään, jotta voit tehdä varauksen."
        />
      </p>
    );
  }

  renderMaxPeriodText(maxPeriod) {
    if (!maxPeriod) {
      return null;
    }
    const duration = moment.duration(maxPeriod);
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    return (
      <p>
        <FormattedMessage
          id="reservation_info.max_period"
          defaultMessage="Varauksen maksimipituus:{days, plural,
            =0 {} one {\u00a0# päivä} other {\u00a0# päivää}}{hours, plural,
            =0 {} one {\u00a0# tunti} other {\u00a0# tuntia}}{minutes, plural,
            =0 {} one {\u00a0# minuutti} other {\u00a0# minuuttia}}."
          values={{ days, hours, minutes }}
        />
      </p>
    );
  }

  renderReservableAfterText(days) {
    if (!days) {
      return null;
    }
    return (
      <p>
        <FormattedMessage
          id="reservation_info.reservable_after_days"
          defaultMessage="Varaus tulee tehdä vähintään {days} {days, plural,
           one {päivä} other {päivää}} etukäteen."
          values={{ days }}
        />
      </p>
    );
  }

  renderReservationInfoText(resource, language) {
    if (!resource || !resource.reservationInfo) {
      return null;
    }
    return (
      <WrappedText text={getTranslatedProperty(resource, 'reservationInfo', language)} />
    );
  }

  renderMaxReservationsPerUserText(maxReservationsPerUser) {
    if (!maxReservationsPerUser) {
      return null;
    }
    return (
      <p>
        <FormattedMessage
          id="reservation_info.max_per_user"
          defaultMessage="Maksimimäärä varauksia per käyttäjä: {amount}"
          values={{ amount: maxReservationsPerUser }}
        />
      </p>
    );
  }

  render() {
    const { intl, isLoggedIn, resource } = this.props;

    return (
      <Well id="reservation-info">
        <h4><FormattedMessage
          id="reservation_info.help_title"
          defaultMessage="Ohjeet varaamiseen"
        /></h4>
        {this.renderReservationInfoText(resource, intl.locale)}
        {this.renderMaxPeriodText(resource.maxPeriod)}
        {this.renderMaxReservationsPerUserText(resource.maxReservationsPerUser)}
        {this.renderReservableAfterText(resource.reservableAfterDays)}
        {this.renderLoginText(isLoggedIn, resource)}
      </Well>
    );
  }
}

ReservationInfo.propTypes = {
  intl: intlShape,
  isLoggedIn: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
};

export default injectIntl(ReservationInfo);
