import type { PasteContent } from "../../render/pasteContent";
import type { DecorationType } from "../../render/renderer";
import type { Segment } from "../../render/segment";
import type { UserEvent, UserEventsQuery } from "../../schedule/events";
import type { BrowserApi } from "../../utils/browser";

export type DateResolver = () =>
	| Promise<Temporal.PlainDate>
	| Temporal.PlainDate;

export type { DecorationType };

export interface ScheduleDeps {
	env: BrowserApi;
	resolveDate: DateResolver;
	loadPeriodEventSetting: () => Promise<boolean>;
	loadDecorationSetting: () => Promise<DecorationType>;
	buildPasteContent: (
		decoration: DecorationType,
		segments: Segment[],
		hostname: string,
	) => PasteContent;
	getUserEvents: (
		hostname: string,
		query: UserEventsQuery,
	) => Promise<UserEvent[]>;
	paste: (content: PasteContent) => void;
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
	buildPasteContent: ScheduleDeps["buildPasteContent"];
	getUserEvents: ScheduleDeps["getUserEvents"];
	paste: ScheduleDeps["paste"];
	getNextBusinessDay: (hostname: string) => Promise<Temporal.PlainDate>;
	getPreviousBusinessDay: (hostname: string) => Promise<Temporal.PlainDate>;
}

export interface SettingsDeps {
	sendOpenSettingsPage: () => Promise<void>;
}
