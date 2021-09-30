import {
    DateTime,
    getNowDateTime,
    isAfterDateTime,
    isDayOfWeek,
    isSameDate,
    stringToDateTime,
} from '../utils/date-time';
import { getCalendarEvents, getMyGroupByIds, getMyGroupVersions } from './api';

export const searchNextBusinessDateTime = async (domain: string): Promise<DateTime> => {
    const publicHolidays = await getPublicHolidays(domain);

    const dateTime = getNowDateTime();
    dateTime.date += 1;

    while (isPublicHoliday(dateTime, publicHolidays) || isDayOfWeek(dateTime, 'Sat') || isDayOfWeek(dateTime, 'Sun')) {
        dateTime.date += 1;
    }

    return dateTime;
};

export const searchPreviousBusinessDateTime = async (domain: string): Promise<DateTime> => {
    const publicHolidays = await getPublicHolidays(domain);

    const dateTime = getNowDateTime();
    dateTime.date -= 1;

    while (isPublicHoliday(dateTime, publicHolidays) || isDayOfWeek(dateTime, 'Sat') || isDayOfWeek(dateTime, 'Sun')) {
        dateTime.date -= 1;
    }

    return dateTime;
};

const getPublicHolidays = async (domain: string): Promise<DateTime[]> => {
    const calendarEvents = await getCalendarEvents(domain);
    const publicHolidays = calendarEvents
        .filter((event) => event.type === 'public_holiday')
        .map((holidayEvent) => stringToDateTime(holidayEvent.date as unknown as string)); // TODO: ドキュメントに記載されている型が間違っているので修正依頼をする
    return insertionSort(publicHolidays); // 一部のデータのみ昇順で並んでいないので挿入ソートが効果的だと思われる
};

const insertionSort = (publicHolidays: DateTime[]) => {
    for (let i = 1; i < publicHolidays.length; i++) {
        let j = i;

        while (j > 0 && isAfterDateTime(publicHolidays[j - 1], publicHolidays[j])) {
            const tmp = publicHolidays[j - 1];
            publicHolidays[j - 1] = publicHolidays[j];
            publicHolidays[j] = tmp;
            j--;
        }
    }

    return publicHolidays;
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

export const getMyGroups = async (domain: string) => {
    const myGroupVersions = await getMyGroupVersions(domain, []);
    const myGroupIds = myGroupVersions.map((version) => version.id);
    const myGroups = await getMyGroupByIds(domain, myGroupIds);
    return myGroups;
};

export const VisibleForTesting = {
    insertionSort,
    isPublicHoliday,
};
