import { getCalendarEvents } from "./api/garoon";

export const getNextBusinessDay = async (
	hostname: string,
): Promise<Temporal.PlainDate> => {
	const publicHolidays = await getPublicHolidays(hostname);
	let nextDate = Temporal.Now.plainDateISO().add({ days: 1 });

	while (isPublicHoliday(nextDate, publicHolidays) || isWeekend(nextDate)) {
		nextDate = nextDate.add({ days: 1 });
	}

	return nextDate;
};

export const getPreviousBusinessDay = async (
	hostname: string,
): Promise<Temporal.PlainDate> => {
	const publicHolidays = await getPublicHolidays(hostname);
	let prevDate = Temporal.Now.plainDateISO().subtract({ days: 1 });

	while (isPublicHoliday(prevDate, publicHolidays) || isWeekend(prevDate)) {
		prevDate = prevDate.subtract({ days: 1 });
	}

	return prevDate;
};

// Garoon のカレンダーイベントの date は YYYY-MM-DD 形式
// https://cybozu.dev/ja/garoon/docs/soap-api/base/get-calendar-events/
const getPublicHolidays = async (
	hostname: string,
): Promise<Temporal.PlainDate[]> => {
	const calendarEvents = await getCalendarEvents(hostname);
	return calendarEvents
		.filter((event) => event.type === "public_holiday")
		.map((holidayEvent) => Temporal.PlainDate.from(holidayEvent.date));
};

const isPublicHoliday = (
	date: Temporal.PlainDate,
	publicHolidays: Temporal.PlainDate[],
): boolean => publicHolidays.some((holiday) => holiday.equals(date));

// dayOfWeek は月曜 1 〜日曜 7
const isWeekend = (date: Temporal.PlainDate): boolean =>
	date.dayOfWeek === 6 || date.dayOfWeek === 7;
