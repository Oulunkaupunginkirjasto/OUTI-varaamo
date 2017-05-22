import { expect } from 'chai';

import keyBy from 'lodash/keyBy';
import Immutable from 'seamless-immutable';

import Purpose from 'fixtures/Purpose';
import groupedPurposesSelector from 'selectors/groupedPurposesSelector';

function getState(purposes) {
  return {
    data: Immutable({
      purposes: keyBy(purposes, 'id'),
    }),
  };
}

describe('Selector: groupedPurposesSelector', () => {
  const parents = ['some-parent', 'other-parent'];
  const purposes = [
    Purpose.build({ parent: parents[0] }),
    Purpose.build({ parent: parents[1] }),
    Purpose.build({ parent: parents[0] }),
  ];

  it('should return an empty object if there are no purposes in state', () => {
    const state = getState([]);
    const actual = groupedPurposesSelector(state);

    expect(actual).to.deep.equal({});
  });

  it('should return purposes from the state grouped by parent', () => {
    const state = getState(purposes);
    const actual = groupedPurposesSelector(state);
    const expected = Immutable({
      [parents[0]]: [purposes[0], purposes[2]],
      [parents[1]]: [purposes[1]],
    });

    expect(actual).to.deep.equal(expected);
  });

  it('should filter out purposes without a parent', () => {
    const purposesWithoutParent = [
      Purpose.build({ parent: null }),
      Purpose.build({ parent: null }),
    ];
    const state = getState(purposesWithoutParent);
    const actual = groupedPurposesSelector(state);

    expect(actual).to.deep.equal({});
  });
});
