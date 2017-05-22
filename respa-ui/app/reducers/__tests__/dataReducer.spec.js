import { expect } from 'chai';

import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';
import User from 'fixtures/User';
import dataReducer, { handleData } from 'reducers/dataReducer';

describe('Reducer: dataReducer', () => {
  describe('initial state', () => {
    const initialState = dataReducer(undefined, {});

    it('reservations should be an empty object', () => {
      expect(initialState.reservations).to.deep.equal({});
    });

    it('resources should be an empty object', () => {
      expect(initialState.resources).to.deep.equal({});
    });

    it('units should be an empty object', () => {
      expect(initialState.units).to.deep.equal({});
    });

    it('users should be an empty object', () => {
      expect(initialState.users).to.deep.equal({});
    });
  });

  describe('handling data', () => {
    const data = {
      resources: {
        'r-1': { value: 'some-value' },
      },
    };

    it('should add the given entities to state', () => {
      const initialState = Immutable({
        resources: {},
      });
      const expectedState = Immutable({
        resources: {
          'r-1': { value: 'some-value' },
        },
      });
      const nextState = handleData(initialState, data);

      expect(nextState).to.deep.equal(expectedState);
    });

    it('should not remove other entities in the same data collection', () => {
      const initialState = Immutable({
        resources: {
          'r-2': { value: 'other-value' },
        },
      });
      const expectedState = Immutable({
        resources: {
          'r-1': { value: 'some-value' },
          'r-2': { value: 'other-value' },
        },
      });
      const nextState = handleData(initialState, data);

      expect(nextState).to.deep.equal(expectedState);
    });

    it('should override values with the same id in the same data collection', () => {
      const initialState = Immutable({
        resources: {
          'r-1': { value: 'override this' },
        },
      });
      const expectedState = Immutable({
        resources: {
          'r-1': { value: 'some-value' },
        },
      });
      const nextState = handleData(initialState, data);

      expect(nextState).to.deep.equal(expectedState);
    });

    it('should not change the other data collections', () => {
      const initialState = Immutable({
        resources: {},
        units: {
          'u-1': { value: 'unit-value' },
        },
      });
      const expectedState = Immutable({
        resources: {
          'r-1': { value: 'some-value' },
        },
        units: {
          'u-1': { value: 'unit-value' },
        },
      });
      const nextState = handleData(initialState, data);

      expect(nextState).to.deep.equal(expectedState);
      expect(nextState.units).to.equal(initialState.units);
    });
  });

  describe('handling actions', () => {
    describe('API.RESERVATION_POST_SUCCESS', () => {
      const postReservationSuccess = createAction(types.API.RESERVATION_POST_SUCCESS);

      it('should add the reservation to reservations', () => {
        const reservation = Reservation.build();
        const initialState = Immutable({
          reservations: {},
          resources: {},
        });
        const action = postReservationSuccess(reservation);
        const nextState = dataReducer(initialState, action);

        const actualReservations = nextState.reservations;
        const expectedReservations = Immutable({
          [reservation.url]: reservation,
        });

        expect(actualReservations).to.deep.equal(expectedReservations);
      });

      it('should add the given reservation to correct resource', () => {
        const resource = Resource.build();
        const reservation = Reservation.build({ resource: resource.id });
        const initialState = Immutable({
          reservations: {},
          resources: { [resource.id]: resource },
        });
        const action = postReservationSuccess(reservation);
        const nextState = dataReducer(initialState, action);
        const actualReservations = nextState.resources[resource.id].reservations;
        const expectedReservations = Immutable([reservation]);

        expect(actualReservations).to.deep.equal(expectedReservations);
      });

      it('should not touch other resource values', () => {
        const resource = Resource.build({
          otherValue: 'whatever',
        });
        const reservation = Reservation.build({ resource: resource.id });
        const initialState = Immutable({
          reservations: {},
          resources: { [resource.id]: resource },
        });
        const action = postReservationSuccess(reservation);
        const nextState = dataReducer(initialState, action);
        const expectedValue = resource.otherValue;
        const actualvalue = nextState.resources[resource.id].otherValue;

        expect(expectedValue).to.deep.equal(actualvalue);
      });
    });

    describe('API.RESERVATION_PUT_SUCCESS', () => {
      const putReservationSuccess = createAction(types.API.RESERVATION_PUT_SUCCESS);

      describe('updating reservations', () => {
        it('should add the reservation to reservations if it is not already there', () => {
          const reservation = Reservation.build();
          const initialState = Immutable({
            reservations: {},
            resources: {},
          });
          const action = putReservationSuccess(reservation);
          const nextState = dataReducer(initialState, action);

          const actualReservations = nextState.reservations;
          const expectedReservations = Immutable({
            [reservation.url]: reservation,
          });

          expect(actualReservations).to.deep.equal(expectedReservations);
        });

        it('should update a reservation already in reservations', () => {
          const oldReservation = Reservation.build({
            begin: 'old-begin',
            end: 'old-end',
          });
          const initialState = Immutable({
            reservations: { [oldReservation.url]: oldReservation },
            resources: {},
          });
          const updatedReservation = Reservation.build({
            begin: 'new-begin',
            end: 'new-end',
            url: oldReservation.url,
          });
          const action = putReservationSuccess(updatedReservation);
          const nextState = dataReducer(initialState, action);

          const actualReservations = nextState.reservations;
          const expectedReservations = Immutable({
            [updatedReservation.url]: updatedReservation,
          });

          expect(actualReservations).to.deep.equal(expectedReservations);
        });
      });

      describe('updating resource reservations', () => {
        it('should add the given reservation to correct resource', () => {
          const resource = Resource.build();
          const reservation = Reservation.build({ resource: resource.id });
          const initialState = Immutable({
            reservations: {},
            resources: { [resource.id]: resource },
          });
          const action = putReservationSuccess(reservation);
          const nextState = dataReducer(initialState, action);
          const actualReservations = nextState.resources[resource.id].reservations;
          const expectedReservations = Immutable([reservation]);

          expect(actualReservations).to.deep.equal(expectedReservations);
        });

        it('should update a reservation already in resource reservations', () => {
          const resource = Resource.build();
          const oldReservation = Reservation.build({
            begin: 'old-begin',
            end: 'old-end',
            resource: resource.id,
          });
          resource.reservations = [oldReservation];

          const initialState = Immutable({
            reservations: {},
            resources: { [resource.id]: resource },
          });
          const updatedReservation = Reservation.build({
            begin: 'new-begin',
            end: 'new-end',
            resource: resource.id,
            url: oldReservation.url,
          });
          const action = putReservationSuccess(updatedReservation);
          const nextState = dataReducer(initialState, action);

          const actualReservations = nextState.resources[resource.id].reservations;
          const expectedReservations = Immutable([updatedReservation]);

          expect(actualReservations).to.deep.equal(expectedReservations);
        });

        it('should not touch other resource values', () => {
          const resource = Resource.build({
            otherValue: 'whatever',
          });
          const reservation = Reservation.build({ resource: resource.id });
          const initialState = Immutable({
            reservations: {},
            resources: { [resource.id]: resource },
          });
          const action = putReservationSuccess(reservation);
          const nextState = dataReducer(initialState, action);
          const expectedValue = resource.otherValue;
          const actualvalue = nextState.resources[resource.id].otherValue;

          expect(expectedValue).to.deep.equal(actualvalue);
        });
      });
    });

    describe('API.RESERVATION_DELETE_SUCCESS', () => {
      const deleteReservationSuccess = createAction(types.API.RESERVATION_DELETE_SUCCESS);

      it('should change reservation state to cancelled in reservations', () => {
        const reservation = Reservation.build({ state: 'confirmed' });
        const initialState = Immutable({
          reservations: { [reservation.url]: reservation },
          resources: {},
        });
        const action = deleteReservationSuccess(reservation);
        const nextState = dataReducer(initialState, action);

        const actual = nextState.reservations[reservation.url];
        const expected = Object.assign({}, reservation, { state: 'cancelled' });

        expect(actual).to.deep.equal(expected);
      });

      it('should change reservation state to cancelled in resource reservations', () => {
        const resource = Resource.build();
        const reservation = Reservation.build({ resource: resource.id, state: 'confirmed' });
        resource.reservations = [reservation];

        const initialState = Immutable({
          reservations: {},
          resources: { [resource.id]: resource },
        });
        const action = deleteReservationSuccess(reservation);
        const nextState = dataReducer(initialState, action);

        const actualReservations = nextState.resources[resource.id].reservations;
        const expected = Immutable([Object.assign({}, reservation, { state: 'cancelled' })]);

        expect(actualReservations[0].state).to.deep.equal(expected[0].state);
      });

      it('should not touch other resource values', () => {
        const resource = Resource.build({
          otherValue: 'whatever',
        });
        const reservation = Reservation.build({ resource: resource.id, state: 'confirmed' });
        const initialState = Immutable({
          reservations: {},
          resources: { [resource.id]: resource },
        });
        const action = deleteReservationSuccess(reservation);
        const nextState = dataReducer(initialState, action);
        const expectedValue = resource.otherValue;
        const actualvalue = nextState.resources[resource.id].otherValue;

        expect(expectedValue).to.deep.equal(actualvalue);
      });
    });

    describe('API.USER_GET_SUCCESS', () => {
      const userGetSuccess = createAction(types.API.USER_GET_SUCCESS);

      it('should add the user to users', () => {
        const user = User.build();
        const initialState = Immutable({
          users: {},
        });
        const action = userGetSuccess(user);
        const nextState = dataReducer(initialState, action);

        const actualUsers = nextState.users;
        const expectedUsers = Immutable({
          [user.uuid]: user,
        });

        expect(actualUsers).to.deep.equal(expectedUsers);
      });

      it('should not affect previous user values', () => {
        const user = User.build({ previousValue: 'value' });
        const updatedUser = User.build({ uuid: user.uuid, newValue: 'newValue' });
        const initialState = Immutable({
          users: { [user.uuid]: user },
        });
        const action = userGetSuccess(updatedUser);
        const nextState = dataReducer(initialState, action);
        const actualUser = nextState.users[user.uuid];

        expect(actualUser.previousValue).to.equal(user.previousValue);
        expect(actualUser.newValue).to.equal(updatedUser.newValue);
      });
    });
  });
});
