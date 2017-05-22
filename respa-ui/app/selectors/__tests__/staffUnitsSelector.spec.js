import { expect } from 'chai';

import Immutable from 'seamless-immutable';

import User from 'fixtures/User';
import staffUnitsSelector from 'selectors/staffUnitsSelector';

function getState(user) {
  return {
    auth: Immutable({
      userId: user.id,
      token: 'mock-token',
    }),
    data: Immutable({
      users: { [user.id]: user },
    }),
  };
}

describe('Selector: staffUnitsSelector', () => {
  it('should return unit ids where user has can_approve_reservation permission', () => {
    const user = User.build({
      staffPerms: {
        unit: {
          'unit-1': ['can_approve_reservation'],
          'unit-2': ['can_approve_reservation'],
        },
      },
    });
    const state = getState(user);
    const selected = staffUnitsSelector(state);
    const expected = ['unit-1', 'unit-2'];

    expect(selected).to.deep.equal(expected);
  });

  it(
    'should not return unit ids where user does not have can_approve_reservation permission',
    () => {
      const user = User.build({
        staffPerms: {
          unit: {
            'unit-1': ['can_approve_something_else'],
            'unit-2': ['can_approve_reservation'],
            'unit-3': [],
          },
        },
      });
      const state = getState(user);
      const selected = staffUnitsSelector(state);
      const expected = ['unit-2'];

      expect(selected).to.deep.equal(expected);
    }
  );

  it('should return an empty array if user has no staff permissions', () => {
    const user = User.build();
    const state = getState(user);
    const selected = staffUnitsSelector(state);

    expect(selected).to.deep.equal([]);
  });

  it('should return an empty array if user has no staff permissions for units', () => {
    const user = User.build({
      staffPerms: {
        unit: {},
      },
    });
    const state = getState(user);
    const selected = staffUnitsSelector(state);

    expect(selected).to.deep.equal([]);
  });
});
