import includes from 'lodash/includes';
import React, { Component, PropTypes } from 'react';
import Table from 'react-bootstrap/lib/Table';
import { FormattedMessage } from 'react-intl';
import Loader from 'react-loader';

import TimeSlot from 'components/reservation/TimeSlot';

class TimeSlots extends Component {
  constructor(props) {
    super(props);
    this.renderTimeSlot = this.renderTimeSlot.bind(this);
  }

  renderTimeSlot(slot) {
    const {
      addNotification,
      disabled,
      isAdmin,
      isEditing,
      isLoggedIn,
      isStaff,
      onClick,
      resource,
      selected,
      time,
    } = this.props;
    const scrollTo = time && time === slot.start;

    return (
      <TimeSlot
        addNotification={addNotification}
        disabled={disabled}
        isAdmin={isAdmin}
        isEditing={isEditing}
        isLoggedIn={isLoggedIn}
        isStaff={isStaff}
        key={slot.start}
        onClick={onClick}
        resource={resource}
        scrollTo={scrollTo}
        selected={includes(selected, slot.asISOString)}
        slot={slot}
      />
    );
  }

  render() {
    const {
      isAdmin,
      isFetching,
      slots,
    } = this.props;

    return (
      <Loader loaded={!isFetching}>
        {slots.length ? (
          <Table
            className="time-slots lined"
            hover
            responsive
          >
            <thead>
              <tr>
                <th />
                <th><FormattedMessage
                  id="timeslots.time"
                  defaultMessage="Aika"
                /></th>
                <th><FormattedMessage
                  id="timeslots.status"
                  defaultMessage="Varaustilanne"
                /></th>
                {isAdmin && <th><FormattedMessage
                  id="timeslots.reserver"
                  defaultMessage="Varaaja"
                /></th>}
                {isAdmin && <th><FormattedMessage
                  id="timeslots.comments"
                  defaultMessage="Kommentit"
                /></th>}
                {isAdmin && <th><FormattedMessage
                  id="timeslots.functions"
                  defaultMessage="Toiminnot"
                /></th>}
              </tr>
            </thead>
            <tbody>
              {slots.map(this.renderTimeSlot)}
            </tbody>
          </Table>
        ) : (
          <p><FormattedMessage
            id="timeslots.not_reservable_today"
            defaultMessage="Ei varattavia aikoja valittuna päivänä."
          /></p>
        )}
      </Loader>
    );
  }
}

TimeSlots.propTypes = {
  addNotification: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  slots: PropTypes.array.isRequired,
  time: PropTypes.string,
};

export default TimeSlots;
