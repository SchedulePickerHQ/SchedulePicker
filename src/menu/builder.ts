import type { ValueOf } from "../types";
import {
	loadContextMenuDisplaySettings,
	loadDecorationSetting,
} from "../utils/storage";

// https://developer.chrome.com/docs/extensions/reference/contextMenus/
type ContextMenuItem = {
	id: string;
	title: string;
	type: "normal" | "radio" | "separator";
	checked?: boolean;
	parentId?: string;
	contexts: "editable"[];
};

export type ContextMenuId = ValueOf<typeof CONTEXT_MENU_ID>;

export const CONTEXT_MENU_ID = {
	ROOT: "ROOT",
	TODAY: "TODAY",
	TOMORROW: "TOMORROW",
	YESTERDAY: "YESTERDAY",
	NEXT_BUSINESS_DAY: "NEXT_BUSINESS_DAY",
	PREVIOUS_BUSINESS_DAY: "PREVIOUS_BUSINESS_DAY",
	SPECIFIED_DAY: "SPECIFIED_DAY",
	TEMPLATE: "TEMPLATE",
	SETTINGS: "SETTINGS",
	DECORATION: "DECORATION",
	STYLED: "STYLED",
	MINIMAL: "MINIMAL",
	PLAIN: "PLAIN",
} as const;

export class ContextMenuBuilder {
	items: ContextMenuItem[];

	constructor() {
		const root: ContextMenuItem = {
			id: CONTEXT_MENU_ID.ROOT,
			title: chrome.i18n.getMessage("ext_name"),
			type: "normal",
			contexts: ["editable"],
		};
		this.items = [root];
	}

	private separatorCount = 0;

	addSeparator() {
		this.separatorCount++;
		this.items.push({
			id: `SEPARATOR_${this.separatorCount}`,
			title: "",
			type: "separator",
			parentId: CONTEXT_MENU_ID.ROOT,
			contexts: ["editable"],
		});
		return this;
	}

	addMenuItem(
		id: ContextMenuId,
		title: string,
		type: "normal" | "radio",
		options?: {
			checked?: boolean;
			parentId?: string;
		},
	) {
		this.items.push({
			id,
			title,
			type,
			checked: options?.checked ?? false,
			parentId: options?.parentId ?? CONTEXT_MENU_ID.ROOT,
			contexts: ["editable"],
		});
		return this;
	}

	addToday() {
		return this.addMenuItem(
			CONTEXT_MENU_ID.TODAY,
			chrome.i18n.getMessage("context_menu_today"),
			"normal",
		);
	}

	addTomorrow() {
		return this.addMenuItem(
			CONTEXT_MENU_ID.TOMORROW,
			chrome.i18n.getMessage("context_menu_tomorrow"),
			"normal",
		);
	}

	addYesterday() {
		return this.addMenuItem(
			CONTEXT_MENU_ID.YESTERDAY,
			chrome.i18n.getMessage("context_menu_yesterday"),
			"normal",
		);
	}

	addNextBusinessDay() {
		return this.addMenuItem(
			CONTEXT_MENU_ID.NEXT_BUSINESS_DAY,
			chrome.i18n.getMessage("context_menu_next_business_day"),
			"normal",
		);
	}

	addPreviousBusinessDay() {
		return this.addMenuItem(
			CONTEXT_MENU_ID.PREVIOUS_BUSINESS_DAY,
			chrome.i18n.getMessage("context_menu_previous_business_day"),
			"normal",
		);
	}

	addSpecifiedDay() {
		return this.addMenuItem(
			CONTEXT_MENU_ID.SPECIFIED_DAY,
			chrome.i18n.getMessage("context_menu_specified_day"),
			"normal",
		);
	}

	addTemplate() {
		return this.addMenuItem(
			CONTEXT_MENU_ID.TEMPLATE,
			chrome.i18n.getMessage("context_menu_template"),
			"normal",
		);
	}

	addSettings() {
		return this.addMenuItem(
			CONTEXT_MENU_ID.SETTINGS,
			chrome.i18n.getMessage("context_menu_settings"),
			"normal",
		);
	}

	addDecoration() {
		return this.addMenuItem(
			CONTEXT_MENU_ID.DECORATION,
			chrome.i18n.getMessage("context_menu_decoration"),
			"normal",
		);
	}

	addStyled({ checked = false }) {
		return this.addMenuItem(
			CONTEXT_MENU_ID.STYLED,
			chrome.i18n.getMessage("context_menu_styled"),
			"radio",
			{ checked, parentId: CONTEXT_MENU_ID.DECORATION },
		);
	}

	addMinimal({ checked = false }) {
		return this.addMenuItem(
			CONTEXT_MENU_ID.MINIMAL,
			chrome.i18n.getMessage("context_menu_minimal"),
			"radio",
			{ checked, parentId: CONTEXT_MENU_ID.DECORATION },
		);
	}

	addPlain({ checked = false }) {
		return this.addMenuItem(
			CONTEXT_MENU_ID.PLAIN,
			chrome.i18n.getMessage("context_menu_plain"),
			"radio",
			{ checked, parentId: CONTEXT_MENU_ID.DECORATION },
		);
	}

	build() {
		return this.items;
	}
}

export const buildContextMenu = async () => {
	await chrome.contextMenus.removeAll();
	const builder = new ContextMenuBuilder();
	const contextMenuDisplaySettings = await loadContextMenuDisplaySettings();

	if (contextMenuDisplaySettings.today) {
		builder.addToday();
	}

	if (contextMenuDisplaySettings.tomorrow) {
		builder.addTomorrow();
	}

	if (contextMenuDisplaySettings.yesterday) {
		builder.addYesterday();
	}

	if (contextMenuDisplaySettings.nextBusinessDay) {
		builder.addNextBusinessDay();
	}

	if (contextMenuDisplaySettings.previousBusinessDay) {
		builder.addPreviousBusinessDay();
	}

	if (contextMenuDisplaySettings.specifiedDay) {
		builder.addSpecifiedDay();
	}

	if (contextMenuDisplaySettings.template) {
		builder.addTemplate();
	}

	builder.addSeparator();

	const decoration = await loadDecorationSetting();
	builder.addDecoration();
	builder.addStyled({ checked: decoration === "styled" });
	builder.addMinimal({ checked: decoration === "minimal" });
	builder.addPlain({ checked: decoration === "plain" });

	builder.addSeparator();

	builder.addSettings();

	const items = builder.build();

	for (const item of items) {
		chrome.contextMenus.create(item);
	}
};
