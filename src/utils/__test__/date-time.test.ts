import MockDate from 'mockdate';
import { DateTime, VisibleForTesting } from '../date-time';

const mockDateTime1: DateTime = {
    year: 2021,
    month: 12,
    date: 4,
    hour: 11,
    minute: 9,
} as const;

const mockDateTime2: DateTime = {
    year: 2021,
    month: 12,
    date: 4,
    hour: 11,
    minute: 8,
} as const;

beforeEach(() => {
    const { year, month, date, hour, minute } = mockDateTime1;
    MockDate.set(new Date(year, month, date, hour, minute, 0, 0));
});

afterEach(() => {
    MockDate.reset();
});

describe('convertToISOString', () => {
    const { convertToISOString } = VisibleForTesting;

    test('Convert to ISO8601 from DateTime', () => {
        expect(convertToISOString(mockDateTime1)).toBe('2021-12-04T02:09:00.000Z');
    });
});

describe('isSameDateTime', () => {
    const { isSameDateTime } = VisibleForTesting;
    test('Same date time', () => {
        expect(isSameDateTime(mockDateTime1, mockDateTime1)).toBe(true);
    });

    test('Different date time', () => {
        expect(isSameDateTime(mockDateTime1, mockDateTime2)).toBe(false);
    });
});

describe('isAfterDateTime', () => {
    const { isAfterDateTime } = VisibleForTesting;

    test('Time of dateTime2 is after dateTime1', () => {
        expect(isAfterDateTime(mockDateTime1, mockDateTime2)).toBe(true);
    });

    test('Time of dateTime2 is before dateTime1', () => {
        expect(isAfterDateTime(mockDateTime2, mockDateTime1)).toBe(false);
    });
});

describe('createStartOfTime', () => {
    const { createStartOfTime } = VisibleForTesting;

    test('Create start of time', () => {
        expect(createStartOfTime(mockDateTime1)).toEqual({
            year: 2021,
            month: 12,
            date: 4,
            hour: 0,
            minute: 0,
        });
    });
});

describe('createEndOfTime', () => {
    const { createEndOfTime } = VisibleForTesting;

    test('Create end of time', () => {
        expect(createEndOfTime(mockDateTime1)).toEqual({
            year: 2021,
            month: 12,
            date: 4,
            hour: 23,
            minute: 59,
        });
    });
});

describe('parseISOString', () => {
    const { parseISOString } = VisibleForTesting;

    test('Convert to DateTime from ISO8601', () => {
        expect(parseISOString('2021-12-04T02:09:00.000Z')).toEqual(mockDateTime1);
    });

    test('Invalid date string format', () => {
        const invalidDateString = '2021/09/04W02:09:00';
        expect(() => parseISOString(invalidDateString)).toThrow(`Invalid date string format : "${invalidDateString}"`);
    });
});

describe('format', () => {
    const { formatDateTime } = VisibleForTesting;

    test('YYYY-MM-DD', () => {
        expect(formatDateTime(mockDateTime1, 'YYYY-MM-DD')).toBe('2021-12-04');
    });
});
