import MockDate from 'mockdate';
import { DateTime, VisibleForTesting } from '../date-time';

const d_2021_12_04__00_00: DateTime = {
    year: 2021,
    month: 12,
    date: 4,
    hour: 0,
    minute: 0,
} as const;

const d_2021_12_04__11_09: DateTime = {
    year: 2021,
    month: 12,
    date: 4,
    hour: 11,
    minute: 9,
} as const;

const d_2021_12_05__11_08: DateTime = {
    year: 2021,
    month: 12,
    date: 5,
    hour: 11,
    minute: 8,
} as const;

beforeEach(() => {
    const { year, month, date, hour, minute } = d_2021_12_04__11_09;
    MockDate.set(new Date(year, month, date, hour, minute, 0, 0));
});

afterEach(() => {
    MockDate.reset();
});

describe('convertToISOString', () => {
    const { convertToISOString } = VisibleForTesting;

    test('Convert to ISO8601 from DateTime', () => {
        expect(convertToISOString(d_2021_12_04__11_09)).toBe('2021-12-04T02:09:00.000Z');
    });
});

describe('isSameDate', () => {
    const { isSameDate } = VisibleForTesting;
    test('Same date time', () => {
        expect(isSameDate(d_2021_12_04__11_09, d_2021_12_04__11_09)).toBe(true);
        expect(isSameDate(d_2021_12_04__11_09, d_2021_12_04__00_00)).toBe(true);
    });

    test('Different date time', () => {
        expect(isSameDate(d_2021_12_04__11_09, d_2021_12_05__11_08)).toBe(false);
    });
});

describe('isAfterDateTime', () => {
    const { isAfterDateTime } = VisibleForTesting;

    test('Date of argument one is after argument two', () => {
        expect(isAfterDateTime(d_2021_12_05__11_08, d_2021_12_04__00_00)).toBe(true);
        expect(isAfterDateTime(d_2021_12_05__11_08, d_2021_12_04__11_09)).toBe(true);
    });

    test('Date of argument one is before argument two', () => {
        expect(isAfterDateTime(d_2021_12_04__00_00, d_2021_12_05__11_08)).toBe(false);
        expect(isAfterDateTime(d_2021_12_04__11_09, d_2021_12_05__11_08)).toBe(false);
    });
});

describe('isDayOfWeek', () => {
    const { isDayOfWeek } = VisibleForTesting;

    test('Saturday', () => {
        expect(isDayOfWeek(d_2021_12_04__00_00, 'Sun')).toBe(false);
        expect(isDayOfWeek(d_2021_12_04__00_00, 'Mon')).toBe(false);
        expect(isDayOfWeek(d_2021_12_04__00_00, 'Tue')).toBe(false);
        expect(isDayOfWeek(d_2021_12_04__00_00, 'Wed')).toBe(false);
        expect(isDayOfWeek(d_2021_12_04__00_00, 'Thu')).toBe(false);
        expect(isDayOfWeek(d_2021_12_04__00_00, 'Fri')).toBe(false);
        expect(isDayOfWeek(d_2021_12_04__00_00, 'Sat')).toBe(true);
    });
});

describe('createStartOfTime', () => {
    const { createStartOfTime } = VisibleForTesting;

    test('Create start of time', () => {
        expect(createStartOfTime(d_2021_12_04__11_09)).toEqual({
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
        expect(createEndOfTime(d_2021_12_04__11_09)).toEqual({
            year: 2021,
            month: 12,
            date: 4,
            hour: 23,
            minute: 59,
        });
    });
});

describe('parseString', () => {
    const { parseString } = VisibleForTesting;

    test('Convert to DateTime from ISO8601', () => {
        expect(parseString('2021-12-04T02:09:00.000Z')).toEqual(d_2021_12_04__11_09);
    });

    test('Convert to DateTime from String', () => {
        expect(parseString('2021-12-04')).toEqual(d_2021_12_04__00_00);
    });
});

describe('format', () => {
    const { formatDateTime } = VisibleForTesting;

    test('YYYY-MM-DD', () => {
        expect(formatDateTime(d_2021_12_04__11_09, 'YYYY-MM-DD')).toBe('2021-12-04');
    });
});
