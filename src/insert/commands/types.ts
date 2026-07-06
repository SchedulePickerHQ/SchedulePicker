import type { UserEvent } from "../../schedule/events";
import type { Formatter } from "../../syntax/formatter";
import type { BrowserApi } from "../../utils/browser";
import type { DateTime } from "../../utils/datetime";

export type DateResolver = () => Promise<DateTime> | DateTime;

export type DecorationType = "styled" | "plain";

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
	// styledHtml を省略すると装飾なし（text/html にもプレーン版が積まれる）
	paste: (plainText: string, styledHtml?: string) => void;
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
	paste: ScheduleDeps["paste"];
	getNextBusinessDay: (hostname: string) => Promise<DateTime>;
	getPreviousBusinessDay: (hostname: string) => Promise<DateTime>;
	getDayOfWeek: (date: DateTime) => string;
}

export interface SettingsDeps {
	sendOpenSettingsPage: () => Promise<void>;
}
