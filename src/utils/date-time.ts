import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

type Date = {
    year: number;
    month: number;
    date: number;
};

type Time = {
    hour: number;
    minute: number;
};

export type DateTime = Date & Time;

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

const dateTimeToDayjs = (dateTime: DateTime) =>
    dayjs()
        .year(dateTime.year)
        .month(dateTime.month - 1)
        .date(dateTime.date)
        .hour(dateTime.hour)
        .minute(dateTime.minute);

const dayjsToDateTime = (dayjsInstance: dayjs.Dayjs) => ({
    year: dayjsInstance.get('year'),
    month: dayjsInstance.get('month') + 1,
    date: dayjsInstance.get('date'),
    hour: dayjsInstance.get('hour'),
    minute: dayjsInstance.get('minute'),
});

export const dateTimeToISOString = (dateTime: DateTime) => dateTimeToDayjs(dateTime).toISOString();

export const stringToDateTime = (str: string): DateTime => dayjsToDateTime(dayjs(str));

export const isSameDate = (dateTime1: DateTime, dateTime2: DateTime) => {
    const dayjsInstance1 = dateTimeToDayjs(dateTime1);
    const dayjsInstance2 = dateTimeToDayjs(dateTime2);
    return dayjsInstance1.isSame(dayjsInstance2, 'date');
};

export const isAfterDateTime = (dateTime: DateTime, afterDateTime: DateTime) => {
    const dayjsInstance1 = dateTimeToDayjs(dateTime);
    const dayjsInstance2 = dateTimeToDayjs(afterDateTime);
    return dayjsInstance1.isAfter(dayjsInstance2);
};

export const isDayOfWeek = (dateTime: DateTime, week: Week) => {
    const index = dateTimeToDayjs(dateTime).day();
    return WEEK[week] === index;
};

export const createStartOfTime = (date: Date): DateTime => ({
    year: date.year,
    month: date.month,
    date: date.date,
    hour: 0,
    minute: 0,
});

export const createEndOfTime = (date: Date): DateTime => ({
    year: date.year,
    month: date.month,
    date: date.date,
    hour: 23,
    minute: 59,
});

export const formatDateTime = (dateTime: DateTime, format: string) => dateTimeToDayjs(dateTime).format(format);

export const isValidDateFormat = (result: string) => /^\d{4}((\/|-)\d{1,2}){2}$/.test(result);

export const getNowDateTime = (): DateTime => {
    const dateTime = dayjsToDateTime(dayjs());
    return {
        year: dateTime.year,
        month: dateTime.month,
        date: dateTime.date,
        hour: dateTime.hour,
        minute: dateTime.minute,
    };
};
