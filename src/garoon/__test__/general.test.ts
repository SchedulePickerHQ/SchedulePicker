import { DateTime } from '../../utils/date-time';
import {
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
} from '../../utils/__test__/mock-datetime';
import { VisibleForTesting } from '../general';

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
