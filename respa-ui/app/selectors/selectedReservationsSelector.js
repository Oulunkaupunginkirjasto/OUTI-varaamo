import moment from 'moment';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import { combineReservations } from 'utils/DataUtils';

const idSelector = (state, props) => props.params.id;
const multiDaySelector = (state) => state.ui.reservations.multiDay;
const selectedSelector = (state) => state.ui.reservations.selected;

const selectedReservationsSelector = createSelector(
  idSelector,
  multiDaySelector,
  selectedSelector,
  (id, multiDay, selected) => {
    if (multiDay.begin && multiDay.end) {
      return [{
        begin: moment(multiDay.begin).toISOString(),
        end: moment(multiDay.end).add(1, 'days').toISOString(),
        resource: id,
      }];
    }
    const selectedSlots = selected.map(current => {
      const dateTimes = current.split('/');
      return {
        begin: dateTimes[0],
        end: dateTimes[1],
        resource: id,
      };
    });
    const selectedReservations = Immutable(combineReservations(selectedSlots));

    return selectedReservations;
  }
);

export default selectedReservationsSelector;
