import { DateTime } from '../date-time';

const createDate_2021_09_XX = (date: number): DateTime => ({
    year: 2021,
    month: 9,
    date,
    hour: 0,
    minute: 0,
});

// Public holidays
export const d_2021_09_18 = createDate_2021_09_XX(18);
export const d_2021_09_19 = createDate_2021_09_XX(19);
export const d_2021_09_20 = createDate_2021_09_XX(20);
export const d_2021_09_23 = createDate_2021_09_XX(23);
export const d_2021_09_25 = createDate_2021_09_XX(25);
export const d_2021_09_26 = createDate_2021_09_XX(26);

// Weekday
export const d_2021_09_17 = createDate_2021_09_XX(17);
export const d_2021_09_21 = createDate_2021_09_XX(21);
export const d_2021_09_22 = createDate_2021_09_XX(22);
export const d_2021_09_24 = createDate_2021_09_XX(24);
export const d_2021_09_27 = createDate_2021_09_XX(27);

export const d_2021_12_04__00_00: DateTime = {
    year: 2021,
    month: 12,
    date: 4,
    hour: 0,
    minute: 0,
} as const;

export const d_2021_12_04__11_09: DateTime = {
    year: 2021,
    month: 12,
    date: 4,
    hour: 11,
    minute: 9,
} as const;

export const d_2021_12_05__11_08: DateTime = {
    year: 2021,
    month: 12,
    date: 5,
    hour: 11,
    minute: 8,
} as const;
