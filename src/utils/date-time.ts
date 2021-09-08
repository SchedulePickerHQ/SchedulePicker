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

const convertToDayjs = (dateTime: DateTime) =>
    dayjs()
        .year(dateTime.year)
        .month(dateTime.month - 1)
        .date(dateTime.date)
        .hour(dateTime.hour)
        .minute(dateTime.minute);

const convertToDateTime = (dayjsInstance: dayjs.Dayjs) => ({
    year: dayjsInstance.get('year'),
    month: dayjsInstance.get('month') + 1,
    date: dayjsInstance.get('date'),
    hour: dayjsInstance.get('hour'),
    minute: dayjsInstance.get('minute'),
});

export const convertToISOString = (dateTime: DateTime) => convertToDayjs(dateTime).toISOString();

export const isSameDate = (dateTime1: DateTime, dateTime2: DateTime) => {
    const dayjsInstance1 = convertToDayjs(dateTime1);
    const dayjsInstance2 = convertToDayjs(dateTime2);
    return dayjsInstance1.isSame(dayjsInstance2, 'date');
};

export const isAfterDateTime = (dateTime: DateTime, afterDateTime: DateTime) => {
    const dayjsInstance1 = convertToDayjs(dateTime);
    const dayjsInstance2 = convertToDayjs(afterDateTime);
    return dayjsInstance1.isAfter(dayjsInstance2);
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

export const parseISOString = (isoString: string): DateTime => {
    const dayjsInstance = dayjs(isoString, ['YYYY-MM-DD HH:mm', 'YYYY-MM-DDTHH:mm:ssZ[Z]'], true);

    if (!dayjsInstance.isValid()) {
        throw new Error(`Invalid date string format : "${isoString}"`);
    }

    return convertToDateTime(dayjsInstance);
};

export const formatDateTime = (dateTime: DateTime, format: string) => convertToDayjs(dateTime).format(format);

export const getNowDateTime = (): DateTime => {
    const dateTime = convertToDateTime(dayjs());
    return {
        year: dateTime.year,
        month: dateTime.month,
        date: dateTime.date,
        hour: dateTime.hour,
        minute: dateTime.minute,
    };
};

export const VisibleForTesting = {
    convertToISOString,
    isSameDate,
    isAfterDateTime,
    createStartOfTime,
    createEndOfTime,
    parseISOString,
    formatDateTime,
};
