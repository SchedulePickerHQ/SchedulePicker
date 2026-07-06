import type { UserEvent } from "../../schedule/events";
import type { Formatter } from "../../syntax/formatter";
import type { DateTime } from "../../utils/datetime";
import {
	convertToEndOfDay,
	convertToStartOfDay,
	dateTime,
} from "../../utils/datetime";
import type { TemplateDeps } from "./types";

const DATE_FORMAT = "YYYY/MM/DD";

type DateEntry = {
	placeholder: string;
	getDate: (deps: TemplateDeps) => Promise<DateTime> | DateTime;
};

const DAY_ENTRIES: DateEntry[] = [
	{ placeholder: "{%TODAY%}", getDate: () => dateTime() },
	{ placeholder: "{%TOMORROW%}", getDate: () => dateTime().add(1, "day") },
	{
		placeholder: "{%YESTERDAY%}",
		getDate: () => dateTime().subtract(1, "day"),
	},
	{
		placeholder: "{%NEXT_BUSINESS_DAY%}",
		getDate: (deps) => deps.getNextBusinessDay(deps.env.hostname),
	},
	{
		placeholder: "{%PREVIOUS_BUSINESS_DAY%}",
		getDate: (deps) => deps.getPreviousBusinessDay(deps.env.hostname),
	},
];

const EVENT_ENTRIES: DateEntry[] = [
	{ placeholder: "{%TODAY_EVENTS%}", getDate: () => dateTime() },
	{
		placeholder: "{%TOMORROW_EVENTS%}",
		getDate: () => dateTime().add(1, "day"),
	},
	{
		placeholder: "{%YESTERDAY_EVENTS%}",
		getDate: () => dateTime().subtract(1, "day"),
	},
	{
		placeholder: "{%NEXT_BUSINESS_DAY_EVENTS%}",
		getDate: (deps) => deps.getNextBusinessDay(deps.env.hostname),
	},
	{
		placeholder: "{%PREVIOUS_BUSINESS_DAY_EVENTS%}",
		getDate: (deps) => deps.getPreviousBusinessDay(deps.env.hostname),
	},
];

// テンプレート本文はユーザー入力の生テキストなので、装飾あり（text/html 貼り付け）では
// 改行がそのままだと空白に潰れてしまう。formatter の改行表現に変換してから使う。
// \r は textarea 経由なら混入しないはずだが、保険として正規化しておく。
export const convertNewLines = (text: string, newLine: string): string =>
	text.replace(/\r\n|\r|\n/g, newLine);

export const replaceDayPlaceholders = async (
	text: string,
	deps: TemplateDeps,
): Promise<string> => {
	for (const { placeholder, getDate } of DAY_ENTRIES) {
		if (text.includes(placeholder)) {
			const date = await getDate(deps);
			const title = `${date.format(DATE_FORMAT)} (${deps.getDayOfWeek(date)})`;
			text = text.replaceAll(placeholder, title);
		}
	}
	return text;
};

// イベント取得と整形を分離し、プレーン版・装飾版の両方を組むときも取得は1回で済むようにする
export const fetchEventsForPlaceholders = async (
	text: string,
	deps: TemplateDeps,
): Promise<Map<string, UserEvent[]>> => {
	const eventsByPlaceholder = new Map<string, UserEvent[]>();

	if (!EVENT_ENTRIES.some(({ placeholder }) => text.includes(placeholder))) {
		return eventsByPlaceholder;
	}

	const periodEventIncluded = await deps.loadPeriodEventSetting();

	for (const { placeholder, getDate } of EVENT_ENTRIES) {
		if (text.includes(placeholder)) {
			const date = await getDate(deps);
			const startTime = convertToStartOfDay(date);
			const endTime = convertToEndOfDay(date);
			const events = await deps.getUserEvents(deps.env.hostname, {
				startTime,
				endTime,
				periodEventIncluded,
			});
			eventsByPlaceholder.set(placeholder, events);
		}
	}

	return eventsByPlaceholder;
};

export const replaceEventPlaceholders = (
	text: string,
	eventsByPlaceholder: Map<string, UserEvent[]>,
	formatter: Formatter,
	hostname: string,
): string => {
	for (const [placeholder, events] of eventsByPlaceholder) {
		text = text.replaceAll(
			placeholder,
			formatter.createEvents(hostname, events),
		);
	}
	return text;
};
