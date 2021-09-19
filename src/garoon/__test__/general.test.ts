import { DateTime } from '../../utils/date-time';
import { VisibleForTesting } from '../general';

const createDate_2021_09_XX = (date: number): DateTime => ({
    year: 2021,
    month: 9,
    date,
    hour: 0,
    minute: 0,
});

// Public holidays
const d_2021_09_18 = createDate_2021_09_XX(18);
const d_2021_09_19 = createDate_2021_09_XX(19);
const d_2021_09_20 = createDate_2021_09_XX(20);
const d_2021_09_23 = createDate_2021_09_XX(23);
const d_2021_09_25 = createDate_2021_09_XX(25);
const d_2021_09_26 = createDate_2021_09_XX(26);

// Weekday
const d_2021_09_17 = createDate_2021_09_XX(17);
const d_2021_09_21 = createDate_2021_09_XX(21);
const d_2021_09_22 = createDate_2021_09_XX(22);
const d_2021_09_24 = createDate_2021_09_XX(24);
const d_2021_09_27 = createDate_2021_09_XX(27);

describe('insetionSort', () => {
    const { insertionSort } = VisibleForTesting;

    test('sort', () => {
        expect(
            insertionSort([
                d_2021_09_18,
                d_2021_09_17,
                d_2021_09_19,
                d_2021_09_27,
                d_2021_09_20,
                d_2021_09_21,
                d_2021_09_23,
                d_2021_09_24,
                d_2021_09_25,
                d_2021_09_22,
                d_2021_09_26,
            ]),
        ).toEqual([
            d_2021_09_17,
            d_2021_09_18,
            d_2021_09_19,
            d_2021_09_20,
            d_2021_09_21,
            d_2021_09_22,
            d_2021_09_23,
            d_2021_09_24,
            d_2021_09_25,
            d_2021_09_26,
            d_2021_09_27,
        ]);
    });
});

describe('isPublicHoliday', () => {
    const { isPublicHoliday } = VisibleForTesting;
    const publicHolidays: DateTime[] = [
        d_2021_09_18,
        d_2021_09_19,
        d_2021_09_20,
        d_2021_09_23,
        d_2021_09_25,
        d_2021_09_26,
    ];

    test('holiday', () => {
        expect(isPublicHoliday(d_2021_09_18, publicHolidays)).toEqual(true);
        expect(isPublicHoliday(d_2021_09_20, publicHolidays)).toEqual(true);
        expect(isPublicHoliday(d_2021_09_23, publicHolidays)).toEqual(true);
        expect(isPublicHoliday(d_2021_09_25, publicHolidays)).toEqual(true);
        expect(isPublicHoliday(d_2021_09_26, publicHolidays)).toEqual(true);
    });

    test('weekday', () => {
        expect(isPublicHoliday(d_2021_09_17, publicHolidays)).toEqual(false);
        expect(isPublicHoliday(d_2021_09_21, publicHolidays)).toEqual(false);
        expect(isPublicHoliday(d_2021_09_22, publicHolidays)).toEqual(false);
        expect(isPublicHoliday(d_2021_09_24, publicHolidays)).toEqual(false);
        expect(isPublicHoliday(d_2021_09_27, publicHolidays)).toEqual(false);
    });
});
