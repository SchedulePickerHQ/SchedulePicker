import type { Segment } from "../../render/segment";
import type { UserEvent } from "../../schedule/events";
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

// テンプレート本文をパースして Segment 列にする。
// イベントの取得はここで済ませ、表現ごとの描画は Renderer に任せる。
export const parseTemplate = async (
	templateText: string,
	deps: TemplateDeps,
): Promise<Segment[]> => {
	// \r は textarea 経由なら混入しないはずだが、保険として正規化しておく
	const normalized = templateText.replace(/\r\n|\r/g, "\n");
	const withDays = await replaceDayPlaceholders(normalized, deps);
	const eventsByPlaceholder = await fetchEventsForPlaceholders(withDays, deps);
	return splitIntoSegments(withDays, eventsByPlaceholder);
};

// 日付プレースホルダーはどの表現でも同じ文字列になるので、パース前にテキストとして解決する
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

const fetchEventsForPlaceholders = async (
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

const splitIntoSegments = (
	text: string,
	eventsByPlaceholder: Map<string, UserEvent[]>,
): Segment[] => {
	const segments: Segment[] = [];
	let rest = text;

	while (rest !== "") {
		const earliest = findEarliestPlaceholder(rest, eventsByPlaceholder);
		if (earliest === null) {
			segments.push({ type: "text", value: rest });
			break;
		}
		if (earliest.index > 0) {
			segments.push({ type: "text", value: rest.slice(0, earliest.index) });
		}
		segments.push({ type: "events", events: earliest.events });
		rest = rest.slice(earliest.index + earliest.placeholder.length);
	}

	return segments;
};

const findEarliestPlaceholder = (
	text: string,
	eventsByPlaceholder: Map<string, UserEvent[]>,
): { index: number; placeholder: string; events: UserEvent[] } | null => {
	let earliest: {
		index: number;
		placeholder: string;
		events: UserEvent[];
	} | null = null;

	for (const [placeholder, events] of eventsByPlaceholder) {
		const index = text.indexOf(placeholder);
		if (index !== -1 && (earliest === null || index < earliest.index)) {
			earliest = { index, placeholder, events };
		}
	}

	return earliest;
};
