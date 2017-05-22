import React, { Component, PropTypes } from 'react';
import Label from 'react-bootstrap/lib/Label';
import Dotdotdot from 'react-dotdotdot';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Link } from 'react-router';

import {
  getAvailableTime,
  getCaption,
  getDescription,
  getMainImage,
  getName,
  getOpeningHours,
} from 'utils/DataUtils';

const messages = defineMessages({
  hoursAvailable: {
    id: 'search_result.hours_available',
    defaultMessage: `{hours, plural,
      one {# tunti}
      other {# tuntia}
    } vapaana`,
  },
  reserve: {
    id: 'search_result.reserve',
    defaultMessage: '. Varaa.',
  },
});

class SearchResult extends Component {
  renderAvailableTime(availableTime) {
    const { intl } = this.props;
    let bsStyle = 'success';
    let reserve = intl.formatMessage(messages.reserve);
    if (availableTime === 0) {
      bsStyle = 'danger';
      reserve = '.';
    }
    return (
      <Label bsStyle={bsStyle}>{
        intl.formatMessage(messages.hoursAvailable, {
          hours: availableTime,
        })
        + reserve}</Label>
    );
  }

  renderImage(image) {
    const { intl } = this.props;
    if (image && image.url) {
      const src = `${image.url}?dim=100x100`;
      return <img alt={getCaption(image, intl.locale)} src={src} />;
    }
    return null;
  }

  render() {
    const { date, intl, result, unit } = this.props;
    const availableTime = getAvailableTime(getOpeningHours(result, date), result.reservations,
      result.reservableBefore, result.reservableAfter);
    const locale = intl.locale;

    return (
      <li>
        <div className="image">
          <Link
            to={`/resources/${result.id}/reservation`}
            query={{ date: date.split('T')[0] }}
          >
            {this.renderImage(getMainImage(result.images))}
          </Link>
        </div>
        <div className="names">
          <Link
            to={`/resources/${result.id}/reservation`}
            query={{ date: date.split('T')[0] }}
          >
            <h4>{getName(result, locale)}</h4>
            <div className="unit-name">{getName(unit, locale)}</div>
          </Link>
        </div>
        <div className="description">
          <Dotdotdot clamp={2}>
            {getDescription(result, locale)}
          </Dotdotdot>
        </div>
        <div className="available-time">
          <Link
            to={`/resources/${result.id}`}
            query={{ date: date.split('T')[0] }}
          >
            <Label bsStyle="primary"><FormattedMessage
              id="search_result.details"
              defaultMessage="Lisätietoja"
            /></Label>
          </Link>
          &nbsp;
          <Link
            to={`/resources/${result.id}/reservation`}
            query={{ date: date.split('T')[0] }}
          >
            {this.renderAvailableTime(availableTime)}
          </Link>
        </div>
      </li>
    );
  }
}

SearchResult.propTypes = {
  date: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  result: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

export default injectIntl(SearchResult);
