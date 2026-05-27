import type { UserEvent } from "../../schedule/events";
import type { Formatter } from "../../syntax/formatter";
import type { BrowserApi } from "../../utils/browser";
import type { DateTime } from "../../utils/datetime";

export type DateResolver = () => Promise<DateTime> | DateTime;

export type SyntaxType =
	| "html"
	| "experimental-html"
	| "markdown"
	| "plainText";

export interface ScheduleDeps {
	env: BrowserApi;
	resolveDate: DateResolver;
	loadPeriodEventSetting: () => Promise<boolean>;
	loadSyntaxSetting: () => Promise<SyntaxType>;
	createFormatter: (syntax: SyntaxType) => Formatter;
	getUserEvents: (
		hostname: string,
		query: {
			startTime: DateTime;
			endTime: DateTime;
			periodEventIncluded: boolean;
		},
	) => Promise<UserEvent[]>;
	insertText: (text: string) => void;
}

export type SpecifiedDayDeps = Omit<ScheduleDeps, "resolveDate">;

export interface SyntaxDeps {
	saveSyntaxSetting: (syntax: SyntaxType) => Promise<void>;
	sendBuildContextMenu: () => Promise<void>;
}

export interface TemplateDeps {
	env: BrowserApi;
	loadTemplateText: () => Promise<string>;
	loadPeriodEventSetting: () => Promise<boolean>;
	loadSyntaxSetting: () => Promise<SyntaxType>;
	createFormatter: (syntax: SyntaxType) => Formatter;
	getUserEvents: ScheduleDeps["getUserEvents"];
	insertText: (text: string) => void;
	getNextBusinessDay: (hostname: string) => Promise<DateTime>;
	getPreviousBusinessDay: (hostname: string) => Promise<DateTime>;
	getDayOfWeek: (date: DateTime) => string;
}

export interface SettingsDeps {
	sendOpenSettingsPage: () => Promise<void>;
}
