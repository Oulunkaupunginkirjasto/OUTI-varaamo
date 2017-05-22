import { expect } from 'chai';
import MockDate from 'mockdate';

import dateSelector from 'selectors/dateSelector';

function getProps(date) {
  return {
    location: {
      query: {
        date,
      },
    },
  };
}

describe('Selector: dateSelector', () => {
  it('should return the date if it is defined', () => {
    const date = '2015-10-10';
    const state = {};
    const props = getProps(date);
    const actual = dateSelector(state, props);

    expect(actual).to.equal(date);
  });

  it('should return current date string if date is not defined', () => {
    const state = {};
    const props = getProps('');
    MockDate.set('2015-12-24T12:00:00Z');
    const actual = dateSelector(state, props);
    MockDate.reset();
    const expected = '2015-12-24';

    expect(actual).to.equal(expected);
  });
});
