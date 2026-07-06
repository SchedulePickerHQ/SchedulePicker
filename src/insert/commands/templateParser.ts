import type { Segment } from "../../render/segment";
import type { UserEvent } from "../../schedule/events";
import type { DateTime } from "../../utils/datetime";
import {
	convertToEndOfDay,
	convertToStartOfDay,
	dateTime,
	formatDateWithDayOfWeek,
} from "../../utils/datetime";
import type { TemplateDeps } from "./types";

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
	const replacements = await Promise.all(
		DAY_ENTRIES.filter(({ placeholder }) => text.includes(placeholder)).map(
			async ({ placeholder, getDate }) =>
				[placeholder, formatDateWithDayOfWeek(await getDate(deps))] as const,
		),
	);
	for (const [placeholder, replacement] of replacements) {
		text = text.replaceAll(placeholder, replacement);
	}
	return text;
};

const fetchEventsForPlaceholders = async (
	text: string,
	deps: TemplateDeps,
): Promise<Map<string, UserEvent[]>> => {
	const matched = EVENT_ENTRIES.filter(({ placeholder }) =>
		text.includes(placeholder),
	);
	if (matched.length === 0) {
		return new Map();
	}

	const periodEventIncluded = await deps.loadPeriodEventSetting();

	// プレースホルダーごとのイベント取得は独立したネットワーク呼び出しなので並列に行う
	const entries = await Promise.all(
		matched.map(async ({ placeholder, getDate }) => {
			const date = await getDate(deps);
			const events = await deps.getUserEvents(deps.env.hostname, {
				startTime: convertToStartOfDay(date),
				endTime: convertToEndOfDay(date),
				periodEventIncluded,
			});
			return [placeholder, events] as const;
		}),
	);
	return new Map(entries);
};

const splitIntoSegments = (
	text: string,
	eventsByPlaceholder: Map<string, UserEvent[]>,
): Segment[] => {
	if (eventsByPlaceholder.size === 0) {
		return text === "" ? [] : [{ type: "text", value: text }];
	}

	// キャプチャ付きで split するとプレースホルダー自身も結果に残るので、
	// 1 回の走査でテキストとプレースホルダーの列が得られる
	const pattern = new RegExp(
		`(${[...eventsByPlaceholder.keys()]
			.map((placeholder) => placeholder.replace(/[{}]/g, "\\$&"))
			.join("|")})`,
	);
	return text.split(pattern).flatMap((part): Segment[] => {
		const events = eventsByPlaceholder.get(part);
		if (events !== undefined) {
			return [{ type: "events", events }];
		}
		return part === "" ? [] : [{ type: "text", value: part }];
	});
};
