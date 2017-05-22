import { expect } from 'chai';

import moment from 'moment';

import constants from 'constants/AppConstants';
import {
  addToDate,
  getDateStartAndEndTimes,
  getDateString,
  getTimeSlots,
} from 'utils/TimeUtils';

describe('Utils: TimeUtils', () => {
  describe('addToDate', () => {
    it('should add days to given date if daysToIncrement is positive', () => {
      const date = '2015-10-10';
      const actual = addToDate(date, 3);
      const expected = '2015-10-13';

      expect(actual).to.equal(expected);
    });

    it('should subtract days from given date if daysToIncrement is negative', () => {
      const date = '2015-10-10';
      const actual = addToDate(date, -3);
      const expected = '2015-10-07';

      expect(actual).to.equal(expected);
    });
  });

  describe('getDateStartAndEndTimes', () => {
    it('should return an empty object if date is undefined', () => {
      const date = undefined;

      expect(getDateStartAndEndTimes(date)).to.deep.equal({});
    });

    it('should return an empty object if date is an empty string', () => {
      const date = '';

      expect(getDateStartAndEndTimes(date)).to.deep.equal({});
    });

    it('should return an object with start and end properties', () => {
      const date = '2015-10-10';
      const actual = getDateStartAndEndTimes(date);

      expect(actual.start).to.exist;
      expect(actual.end).to.exist;
    });

    it('returned start and end times should be in correct form ', () => {
      const date = '2015-10-10';
      const actual = getDateStartAndEndTimes(date);

      expect(actual.start).to.equal(`${date}T00:00:00Z`);
      expect(actual.end).to.equal(`${date}T23:59:59Z`);
    });
  });

  describe('getDateString', () => {
    it('should return current date string if date is undefined', () => {
      const date = undefined;
      const expected = moment().format(constants.DATE_FORMAT);

      expect(getDateString(date)).to.equal(expected);
    });

    it('should return current date string if date is an empty string', () => {
      const date = '';
      const expected = moment().format(constants.DATE_FORMAT);

      expect(getDateString(date)).to.equal(expected);
    });

    it('should return the date unchanged', () => {
      const date = '2015-10-11';

      expect(getDateString(date)).to.equal(date);
    });
  });

  describe('getTimeSlots', () => {
    describe('When critical info is missing', () => {
      const start = '2015-10-09T08:00:00+03:00';
      const end = '2015-10-09T10:00:00+03:00';
      const period = '00:30:00';

      it('should return an empty array if start is missing', () => {
        const actual = getTimeSlots(undefined, end, period);

        expect(actual).to.deep.equal([]);
      });

      it('should return an empty array if end is missing', () => {
        const actual = getTimeSlots(start, undefined, period);

        expect(actual).to.deep.equal([]);
      });

      it('should use 30 minutes as default duration if period is missing', () => {
        const actual = getTimeSlots(start, end, undefined);

        expect(actual.length).to.equal(4);
      });

      it('should use empty array as default reservations if no reservations is given', () => {
        const timeSlots = getTimeSlots(start, end, period);

        timeSlots.forEach(timeSlot => {
          expect(timeSlot.reserved).to.equal(false);
        });
      });
    });

    describe('When dividing 2 hours into 30 min slots', () => {
      const start = '2015-10-09T08:00:00+03:00';
      const end = '2015-10-09T10:00:00+03:00';
      const period = '00:30:00';
      const duration = moment.duration(period);
      const slots = getTimeSlots(start, end, period);

      it('should return an array of length 4', () => {
        expect(slots.length).to.equal(4);
      });

      describe('slot start and end times', () => {
        it('returned slots should contain start and end properties', () => {
          expect(slots[0].start).to.exist;
          expect(slots[0].end).to.exist;
        });

        it('start and end times should be in UTC', () => {
          expect(slots[0].start.endsWith('Z')).to.equal(true);
          expect(slots[0].end.endsWith('Z')).to.equal(true);
        });

        it('the first time slot should start when the time range starts', () => {
          const expected = moment.utc(start).toISOString();

          expect(slots[0].start).to.equal(expected);
        });

        it('the first time slot should end 30 minutes after start', () => {
          const expected = moment.utc(start).add(duration).toISOString();

          expect(slots[0].end).to.equal(expected);
        });

        it('the last time slot should start 30 minutes before the time range ends', () => {
          const expected = moment.utc(end).subtract(duration).toISOString();

          expect(slots[3].start).to.equal(expected);
        });

        it('the last time slot should end 30 minutes after start', () => {
          const expected = moment.utc(end).toISOString();

          expect(slots[3].end).to.equal(expected);
        });
      });

      describe('slot asISOString property', () => {
        it('returned slots should contain asISOString property', () => {
          expect(slots[0].asISOString).to.exist;
        });

        it('should be proper ISO format range representation', () => {
          const startUTC = moment.utc(start);
          const endUTC = moment.utc(startUTC).add(duration);
          const expected = `${startUTC.toISOString()}/${endUTC.toISOString()}`;

          expect(slots[0].asISOString).to.equal(expected);
        });
      });

      describe('slot asString property', () => {
        it('returned slots should contain asString property', () => {
          expect(slots[0].asString).to.exist;
        });

        it('should show the slot time range in local time', () => {
          const startLocal = moment(start);
          const endLocal = moment(startLocal).add(duration);
          const startString = startLocal.format(constants.TIME_FORMAT);
          const endString = endLocal.format(constants.TIME_FORMAT);
          const expected = `${startString}\u2013${endString}`;

          expect(slots[0].asString).to.equal(expected);
        });
      });
    });

    describe('slot reserved property', () => {
      const start = '2015-10-09T08:00:00+03:00';
      const end = '2015-10-09T10:00:00+03:00';
      const period = '00:30:00';

      describe('with one reservation', () => {
        const reservations = [
          {
            begin: '2015-10-09T08:30:00+03:00',
            end: '2015-10-09T09:30:00+03:00',
          },
        ];
        const slots = getTimeSlots(start, end, period, reservations);

        it('slot should not be marked reserved if reservation starts when slot ends', () => {
          expect(slots[0].reserved).to.equal(false);
        });

        it('should mark all the slots that are during reservation as reserved', () => {
          expect(slots[1].reserved).to.equal(true);
          expect(slots[2].reserved).to.equal(true);
        });

        it('slot should not be marked reserved if slots starts when reservation ends', () => {
          expect(slots[3].reserved).to.equal(false);
        });
      });

      describe('with multiple reservations', () => {
        const reservations = [
          {
            begin: '2015-10-09T08:30:00+03:00',
            end: '2015-10-09T09:00:00+03:00',
          },
          {
            begin: '2015-10-09T09:30:00+03:00',
            end: '2015-10-09T10:00:00+03:00',
          },
        ];
        const slots = getTimeSlots(start, end, period, reservations);

        it('should use all reservations to find reserved slots', () => {
          expect(slots[0].reserved).to.equal(false);
          expect(slots[1].reserved).to.equal(true);
          expect(slots[2].reserved).to.equal(false);
          expect(slots[3].reserved).to.equal(true);
        });
      });
    });

    describe('slot reservationStarting and reservationEnding properties during reservation', () => {
      const start = '2015-10-09T08:00:00+03:00';
      const end = '2015-10-09T09:30:00+03:00';
      const period = '00:30:00';
      const reservations = [
        {
          begin: '2015-10-09T08:00:00+03:00',
          end: '2015-10-09T09:30:00+03:00',
        },
      ];
      const slots = getTimeSlots(start, end, period, reservations);

      it('only first slot should have reservationStarting property', () => {
        expect(slots[0].reservationStarting).to.equal(true);
        expect(slots[1].reservationStarting).to.equal(false);
        expect(slots[2].reservationStarting).to.equal(false);
      });

      it('only last slot should have reservationEnding property', () => {
        expect(slots[0].reservationEnding).to.equal(false);
        expect(slots[1].reservationEnding).to.equal(false);
        expect(slots[2].reservationEnding).to.equal(true);
      });
    });

    describe('slot editing property', () => {
      const start = '2015-10-09T08:00:00+03:00';
      const end = '2015-10-09T10:00:00+03:00';
      const period = '00:30:00';
      const reservations = [];

      describe('with one reservation to edit', () => {
        const reservationsToEdit = [
          {
            begin: '2015-10-09T08:30:00+03:00',
            end: '2015-10-09T09:30:00+03:00',
          },
        ];
        const slots = getTimeSlots(start, end, period, reservations, reservationsToEdit);

        it('slot should not be marked as editing if reservation starts when slot ends', () => {
          expect(slots[0].editing).to.equal(false);
        });

        it('should mark all the slots that are during reservation as editing', () => {
          expect(slots[1].editing).to.equal(true);
          expect(slots[2].editing).to.equal(true);
        });

        it('slot should not be marked editing if slots starts when reservation ends', () => {
          expect(slots[3].editing).to.equal(false);
        });
      });

      describe('with multiple reservationsToEdit', () => {
        const reservationsToEdit = [
          {
            begin: '2015-10-09T08:30:00+03:00',
            end: '2015-10-09T09:00:00+03:00',
          },
          {
            begin: '2015-10-09T09:30:00+03:00',
            end: '2015-10-09T10:00:00+03:00',
          },
        ];
        const slots = getTimeSlots(start, end, period, reservations, reservationsToEdit);

        it('should use all reservations to find slots that are edited', () => {
          expect(slots[0].editing).to.equal(false);
          expect(slots[1].editing).to.equal(true);
          expect(slots[2].editing).to.equal(false);
          expect(slots[3].editing).to.equal(true);
        });
      });
    });
  });
});
