import { dateTime, getWeekIndex, type DateTime } from "~utils/datetime";

import { getCalendarEvents } from "./api/garoon";

export const getNextBusinessDateTime = async (hostname: string): Promise<DateTime> => {
  const publicHolidays = await getPublicHolidays(hostname);
  let nextDate = dateTime().add(1, "day");

  while (
    isPublicHoliday(nextDate, publicHolidays) ||
    nextDate.day() === getWeekIndex("Sat") ||
    nextDate.day() === getWeekIndex("Sun")
  ) {
    nextDate = nextDate.add(1, "day");
  }

  return nextDate;
};

export const getPreviousBusinessDateTime = async (hostname: string): Promise<DateTime> => {
  const publicHolidays = await getPublicHolidays(hostname);
  let prevDate = dateTime().subtract(1, "day");

  while (
    isPublicHoliday(prevDate, publicHolidays) ||
    prevDate.day() === getWeekIndex("Sat") ||
    prevDate.day() === getWeekIndex("Sun")
  ) {
    prevDate = prevDate.subtract(1, "day");
  }

  return prevDate;
};

const getPublicHolidays = async (hostname: string): Promise<DateTime[]> => {
  const calendarEvents = await getCalendarEvents(hostname);
  const publicHolidays = calendarEvents
    .filter((event) => event.type === "public_holiday")
    .map((holidayEvent) => dateTime(holidayEvent.date as unknown as string)); // TODO: ドキュメントに記載されている型が間違っているので修正PRを投げる
  return insertionSort(publicHolidays); // 一部のデータが昇順で並んでいないため、挿入ソートする
};

const insertionSort = (publicHolidays: DateTime[]) => {
  for (let i = 1; i < publicHolidays.length; i++) {
    let j = i;

    while (j > 0 && publicHolidays[j - 1].isAfter(publicHolidays[j])) {
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

    if (holiday.isSame(dateTime)) {
      return true;
    }

    if (dateTime.isAfter(holiday)) {
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return false;
};
