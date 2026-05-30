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

export const replaceEventPlaceholders = async (
	text: string,
	deps: TemplateDeps,
): Promise<string> => {
	if (!EVENT_ENTRIES.some(({ placeholder }) => text.includes(placeholder))) {
		return text;
	}

	const periodEventIncluded = await deps.loadPeriodEventSetting();
	const decoration = await deps.loadDecorationSetting();
	const formatter = deps.createFormatter(decoration);

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
			text = text.replaceAll(
				placeholder,
				formatter.createEvents(deps.env.hostname, events),
			);
		}
	}

	return text;
};
