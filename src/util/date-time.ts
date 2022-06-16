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

export const getWeekIndex = (week: Week): TypeOfValues<Week> => WEEK[week];

export const convertToStartOfDay = (arg: DateTime): DateTime => {
    return arg.startOf('day');
};

export const convertToEndOfDay = (arg: DateTime): DateTime => {
    return arg.endOf('day');
};

export const isValidDateFormat = (result: string) => /^\d{4}((\/|-)\d{1,2}){2}$/.test(result);
