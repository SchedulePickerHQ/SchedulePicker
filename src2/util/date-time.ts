import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export type DateTime = dayjs.Dayjs;

export const dateTime = (date?: dayjs.ConfigType, format?: dayjs.OptionType, strict?: boolean) =>
    dayjs(date, format, strict);

const WEEK = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
} as const;

type Week = keyof typeof WEEK;

export const getWeekIndex = (week: Week) => WEEK[week];
