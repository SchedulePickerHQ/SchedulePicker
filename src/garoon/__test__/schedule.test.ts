import { VisibleForTesting } from '../schedule';
import { mockGaroonApiScheduleEvents, mockScheduleEvents } from './mock-schedule';

describe('isEventTypeRegularOrRepeating', () => {
    const { isEventTypeRegularOrRepeating } = VisibleForTesting;

    test('Event type is REGULAR or REPEATING.', () => {
        expect(isEventTypeRegularOrRepeating('REGULAR')).toBe(true);
        expect(isEventTypeRegularOrRepeating('REPEATING')).toBe(true);
    });

    test('Event type is ALL_DAY.', () => {
        expect(isEventTypeRegularOrRepeating('ALL_DAY')).toBe(false);
    });
});

describe('sortByTime', () => {
    const { sortByTime } = VisibleForTesting;

    test('Sort by time', () => {
        const randomEvents = mockScheduleEvents.sort(() => Math.random() - 0.5);
        expect(randomEvents.sort(sortByTime)).toEqual(mockScheduleEvents);
    });
});

describe('convertToScheduleEvent', () => {
    const { convertToScheduleEvent } = VisibleForTesting;
    const startTime = {
        'year': 2021,
        'month': 9,
        'date': 19,
        'hour': 0,
        'minute': 0,
    };
    const endTime = {
        'year': 2021,
        'month': 9,
        'date': 19,
        'hour': 23,
        'minute': 59,
    };

    test.each(mockGaroonApiScheduleEvents)('Convert succeeded', (garoonApiEvent) => {
        const expected = mockScheduleEvents.find((event) => event.id === garoonApiEvent.id);
        expect(convertToScheduleEvent(garoonApiEvent, startTime, endTime)).toEqual(expected);
    });
});
