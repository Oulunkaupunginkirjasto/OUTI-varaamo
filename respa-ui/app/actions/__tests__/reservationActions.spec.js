import { expect } from 'chai';
import simple from 'simple-mock';

import * as apiUtils from 'utils/APIUtils';
import * as reservationActions from 'actions/reservationActions';

describe('Actions: reservationActions', () => {
  const reservation = {
    url: 'http://reservation.url',
    resource: '1234qwert',
  };

  let getRequestTypeDescriptorMock;
  beforeEach(() => {
    getRequestTypeDescriptorMock = simple.mock(apiUtils, 'getRequestTypeDescriptor');
  });

  describe('deleteReservation', () => {
    it('includes correct track in meta', () => {
      reservationActions.deleteReservation(reservation);
      expect(getRequestTypeDescriptorMock.lastCall.args[1].meta.track).to.deep.equal({
        event: 'trackEvent',
        args: [
          'Reservation',
          'reservation-cancel',
          reservation.resource,
        ],
      });
    });
  });
  describe('postReservation', () => {
    it('includes correct track in meta', () => {
      reservationActions.postReservation(reservation);
      expect(getRequestTypeDescriptorMock.lastCall.args[1].meta.track).to.deep.equal({
        event: 'trackEvent',
        args: [
          'Reservation',
          'reservation-add',
          reservation.resource,
        ],
      });
    });
  });
  describe('putReservation', () => {
    it('includes correct track in meta', () => {
      reservationActions.putReservation(reservation);
      expect(getRequestTypeDescriptorMock.lastCall.args[1].meta.track).to.deep.equal({
        event: 'trackEvent',
        args: [
          'Reservation',
          'reservation-edit',
          reservation.resource,
        ],
      });
    });
  });
});
