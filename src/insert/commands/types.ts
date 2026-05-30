import type { UserEvent } from "../../schedule/events";
import type { Formatter } from "../../syntax/formatter";
import type { BrowserApi } from "../../utils/browser";
import type { DateTime } from "../../utils/datetime";

export type DateResolver = () => Promise<DateTime> | DateTime;

export type DecorationType = "styled" | "minimal" | "plain";

export interface ScheduleDeps {
	env: BrowserApi;
	resolveDate: DateResolver;
	loadPeriodEventSetting: () => Promise<boolean>;
	loadDecorationSetting: () => Promise<DecorationType>;
	createFormatter: (decoration: DecorationType) => Formatter;
	getUserEvents: (
		hostname: string,
		query: {
			startTime: DateTime;
			endTime: DateTime;
			periodEventIncluded: boolean;
		},
	) => Promise<UserEvent[]>;
	paste: (text: string, decoration: DecorationType) => void;
}

export type SpecifiedDayDeps = Omit<ScheduleDeps, "resolveDate">;

export interface DecorationDeps {
	saveDecorationSetting: (decoration: DecorationType) => Promise<void>;
	sendBuildContextMenu: () => Promise<void>;
}

export interface TemplateDeps {
	env: BrowserApi;
	loadTemplateText: () => Promise<string>;
	loadPeriodEventSetting: () => Promise<boolean>;
	loadDecorationSetting: () => Promise<DecorationType>;
	createFormatter: (decoration: DecorationType) => Formatter;
	getUserEvents: ScheduleDeps["getUserEvents"];
	paste: (text: string, decoration: DecorationType) => void;
	getNextBusinessDay: (hostname: string) => Promise<DateTime>;
	getPreviousBusinessDay: (hostname: string) => Promise<DateTime>;
	getDayOfWeek: (date: DateTime) => string;
}

export interface SettingsDeps {
	sendOpenSettingsPage: () => Promise<void>;
}
