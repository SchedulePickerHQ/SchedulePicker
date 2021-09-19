import {
    DateTime,
    getNowDateTime,
    isAfterDateTime,
    isDayOfWeek,
    isSameDate,
    stringToDateTime,
} from '../utils/date-time';
import { getCalendarEvents } from './api';

export const searchNextBusinessDateTime = async (domain: string): Promise<DateTime> => {
    const publicHolidays = await getPublicHolidays(domain);

    const dateTime = getNowDateTime();
    Object.assign(dateTime, { date: dateTime.date + 1 });

    while (isPublicHoliday(dateTime, publicHolidays) || isDayOfWeek(dateTime, 'Sat') || isDayOfWeek(dateTime, 'Sun')) {
        Object.assign(dateTime, { date: dateTime.date + 1 });
    }

    // TODO: 9/21 取得したいのに 9/20 が取得される
    return dateTime;
};

const getPublicHolidays = async (domain: string): Promise<DateTime[]> => {
    const calendarEvents = await getCalendarEvents(domain);
    return calendarEvents
        .filter((event) => event.type === 'public_holiday')
        .map((holidayEvent) => stringToDateTime(holidayEvent.date as unknown as string)); // TODO: ドキュメントに記載されている型が間違っているので修正依頼をする
};

const isPublicHoliday = (dateTime: DateTime, publicHolidays: DateTime[]): boolean => {
    let low = 0;
    let high = publicHolidays.length - 1;
    let middle: number;

    while (low <= high) {
        middle = Math.floor((high + low) / 2);
        const holiday = publicHolidays[middle];

        if (isSameDate(holiday, dateTime)) {
            return true;
        }

        if (isAfterDateTime(dateTime, holiday)) {
            low = middle + 1;
        } else {
            high = middle - 1;
        }
    }

    return false;
};

export const VisibleForTesting = {
    isPublicHoliday,
    searchNextBusinessDay: searchNextBusinessDateTime,
};
