import MockDate from 'mockdate';
import {
    createEndOfTime,
    createStartOfTime,
    dateTimeToISOString,
    formatDateTime,
    isAfterDateTime,
    isDayOfWeek,
    isSameDate,
    isValidDateFormat,
    stringToDateTime,
} from '../date-time';
import { d_2021_12_04__00_00, d_2021_12_04__11_09, d_2021_12_05__11_08 } from './mock-datetime';

beforeEach(() => {
    const { year, month, date, hour, minute } = d_2021_12_04__11_09;
    MockDate.set(new Date(year, month, date, hour, minute, 0, 0));
});

afterEach(() => {
    MockDate.reset();
});

describe('dateTimeToISOString', () => {
    test('Convert to ISO8601 from DateTime', () => {
        expect(dateTimeToISOString(d_2021_12_04__11_09)).toBe('2021-12-04T02:09:00.000Z');
    });
});

describe('isSameDate', () => {
    test('Same date time', () => {
        expect(isSameDate(d_2021_12_04__11_09, d_2021_12_04__11_09)).toBe(true);
        expect(isSameDate(d_2021_12_04__11_09, d_2021_12_04__00_00)).toBe(true);
    });

    test('Different date time', () => {
        expect(isSameDate(d_2021_12_04__11_09, d_2021_12_05__11_08)).toBe(false);
    });
});

describe('isAfterDateTime', () => {
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

describe('stringToDateTime', () => {
    test('Convert to DateTime from ISO8601', () => {
        expect(stringToDateTime('2021-12-04T02:09:00.000Z')).toEqual(d_2021_12_04__11_09);
    });

    test('Convert to DateTime from String', () => {
        expect(stringToDateTime('2021-12-04')).toEqual(d_2021_12_04__00_00);
        expect(stringToDateTime('2021/12/04')).toEqual(d_2021_12_04__00_00);
        expect(stringToDateTime('2021/12/4')).toEqual(d_2021_12_04__00_00);
    });
});

describe('formatDateTime', () => {
    test('YYYY-MM-DD', () => {
        expect(formatDateTime(d_2021_12_04__11_09, 'YYYY-MM-DD')).toBe('2021-12-04');
    });
});

describe('isValidDateFormat', () => {
    test.each([
        '2021/09/01',
        '2021/12/21',
        '2021/9/1',
        '2021/12/03',
        '2021-09-01',
        '2021-12-21',
        '2021-9-1',
        '2021-12-03',
    ])('Valid', (value) => {
        expect(isValidDateFormat(value)).toBe(true);
    });

    test.each([
        '2021',
        '2021/09',
        '2021-09',
        '2021/09/',
        '2021-09-',
        '12345/09/01',
        '12345-09-01',
        '2021/09/01a',
        '2021-09-01a',
        'aaaa/bb/cc',
        '202/09/01',
        '202-09-01',
        '09/01',
        '09-01',
        '/09/01',
        '-09-01',
    ])('Invalid', (value) => {
        expect(isValidDateFormat(value)).toBe(false);
    });
});
