import { getScheduleEvents, type ScheduleEvent } from "./api/garoon";

export class GetEventsError extends Error {
	name = "GetEventsError";
}

// 日付は Temporal.PlainDate、予定の開始・終了は Temporal.ZonedDateTime で扱う。
// 日付に時刻を持たせないことで、日付同士の比較に時刻が紛れ込まないようにする
export type UserEventsQuery = {
	date: Temporal.PlainDate;
	periodEventIncluded: boolean;
};

export type UserEvent = {
	id: string;
	subject: string;
	startTime: Temporal.ZonedDateTime;
	endTime: Temporal.ZonedDateTime;
	eventType: "REGULAR" | "REPEATING" | "ALL_DAY" | "TEMPORARY";
	eventMenu: string;
	visibilityType?: "PUBLIC" | "PRIVATE";
	isStartOnly: boolean;
	isAllDay: boolean;
	isContinuingFromYesterday: boolean;
	isContinuingToTomorrow: boolean;
};

// 対象日の 0:00:00.000 から 23:59:59.999 まで（実行環境の既定タイムゾーン。Chrome では OS の設定）
type DayRange = {
	date: Temporal.PlainDate;
	timeZone: string;
	start: Temporal.ZonedDateTime;
	end: Temporal.ZonedDateTime;
};

const toDayRange = (date: Temporal.PlainDate): DayRange => {
	const timeZone = Temporal.Now.timeZoneId();
	return {
		date,
		timeZone,
		start: date.toZonedDateTime(timeZone),
		end: date
			.add({ days: 1 })
			.toZonedDateTime(timeZone)
			.subtract({ milliseconds: 1 }),
	};
};

// Garoon に渡す日時。ミリ秒まで固定で出すのは、Instant#toString の既定だと
// 端数の桁数が値によって変わる（.999 や 9 桁のナノ秒）ため
const toGaroonDateTime = (time: Temporal.ZonedDateTime) =>
	time.toInstant().toString({ smallestUnit: "millisecond" });

export const getUserEvents = async (
	hostname: string,
	query: UserEventsQuery,
): Promise<UserEvent[]> => {
	const range = toDayRange(query.date);
	let events: ScheduleEvent[];
	try {
		events = await getScheduleEvents(hostname, {
			rangeStart: toGaroonDateTime(range.start),
			rangeEnd: toGaroonDateTime(range.end),
		});
	} catch {
		throw new GetEventsError();
	}

	return events
		.filter((event) =>
			query.periodEventIncluded ? true : event.eventType !== "ALL_DAY",
		)
		.map((event) => convertToUserEvent(event, range))
		.sort(sortByTime);
};

// Garoon の予定の dateTime はオフセット付きの RFC 3339 形式（例: 2025-01-15T10:00:00+09:00）
const parseGaroonDateTime = (dateTime: string, timeZone: string) =>
	Temporal.Instant.from(dateTime).toZonedDateTimeISO(timeZone);

const convertToUserEvent = (
	scheduleEvent: ScheduleEvent,
	range: DayRange,
): UserEvent => {
	const eventStart = parseGaroonDateTime(
		scheduleEvent.start.dateTime,
		range.timeZone,
	);
	const isContinuingFromYesterday =
		Temporal.PlainDate.compare(eventStart.toPlainDate(), range.date) < 0;
	const startTime = isContinuingFromYesterday ? range.start : eventStart;

	const eventEnd =
		!scheduleEvent.isStartOnly && "end" in scheduleEvent
			? parseGaroonDateTime(scheduleEvent.end.dateTime, range.timeZone)
			: null;
	// 終了時刻が登録されていない予定は、翌日へ続くものとして扱う
	const isContinuingToTomorrow =
		eventEnd === null ||
		Temporal.PlainDate.compare(eventEnd.toPlainDate(), range.date) > 0;
	const endTime = isContinuingToTomorrow ? range.end : eventEnd;

	const isPrivateEvent = scheduleEvent.visibilityType === "PRIVATE";
	const subject = isPrivateEvent ? "非公開予定" : scheduleEvent.subject;
	const eventMenu = isPrivateEvent ? "" : scheduleEvent.eventMenu;

	return {
		id: scheduleEvent.id,
		subject,
		startTime,
		endTime,
		eventType: scheduleEvent.eventType,
		eventMenu,
		visibilityType: scheduleEvent.visibilityType,
		isAllDay: scheduleEvent.isAllDay,
		isStartOnly: scheduleEvent.isStartOnly,
		isContinuingFromYesterday,
		isContinuingToTomorrow,
	};
};

const sortByTime = (event1: UserEvent, event2: UserEvent) => {
	if (event1.isAllDay) {
		return 1;
	}

	if (event2.isAllDay) {
		return -1;
	}

	return (
		Temporal.ZonedDateTime.compare(event1.startTime, event2.startTime) ||
		Temporal.ZonedDateTime.compare(event1.endTime, event2.endTime)
	);
};
