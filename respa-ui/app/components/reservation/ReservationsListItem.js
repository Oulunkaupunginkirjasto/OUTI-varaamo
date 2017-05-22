import isEmpty from 'lodash/isEmpty';
import React, { Component, PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { Link } from 'react-router';

import TimeRange from 'components/common/TimeRange';
import ReservationControls from 'containers/ReservationControls';
import { renderReservationStateLabel } from 'utils/renderUtils';
import {
  getCaption,
  getMainImage,
  getName,
} from 'utils/DataUtils';

class ReservationsListItem extends Component {
  renderImage(image, language) {
    if (image && image.url) {
      const src = `${image.url}?dim=100x120`;
      return <img alt={getCaption(image, language)} src={src} />;
    }
    return null;
  }

  render() {
    const {
      intl,
      isAdmin,
      isStaff,
      reservation,
      resource,
      unit,
    } = this.props;
    const locale = intl.locale;

    const nameSeparator = isEmpty(resource) || isEmpty(unit) ? '' : ', ';

    return (
      <li className="reservation">
        <div className="image">
          <Link to={`/resources/${resource.id}`}>
            {this.renderImage(getMainImage(resource.images), locale)}
          </Link>
        </div>
        <div className="names">
          <Link to={`/resources/${resource.id}`}>
            <h4>
              {getName(resource, locale)}{nameSeparator}
              <span className="unit-name">{getName(unit, locale)}</span>
            </h4>
          </Link>
        </div>
        <div className="time">
          <Link
            to={`/resources/${resource.id}/reservation`}
            query={{
              date: reservation.begin.split('T')[0],
              time: reservation.begin,
            }}
          >
            <TimeRange
              begin={reservation.begin}
              end={reservation.end}
              className="hidden-xs"
            />
            <TimeRange
              begin={reservation.begin}
              dateFormat="dd, D.M."
              end={reservation.end}
              className="visible-xs-block"
            />
          </Link>
        </div>
        {renderReservationStateLabel(reservation, locale)}
        <ReservationControls
          isAdmin={isAdmin}
          isStaff={isStaff}
          reservation={reservation}
          resource={resource}
        />
      </li>
    );
  }
}

ReservationsListItem.propTypes = {
  intl: intlShape.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

export default injectIntl(ReservationsListItem);
