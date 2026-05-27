// chrome.storage.sync は内部的に値を JSON でシリアライズ/デシリアライズするため、
// localStorage と異なり boolean や object がそのままの型で復元される。
// 各 load 関数の typeof チェックはストレージ破損や過去バージョンとの互換のための防御的バリデーション。
import type { SyntaxType } from "../insert/commands/types";

type StorageValue = {
	SYNTAX: SyntaxType;
	CONTEXT_MENU_DISPLAYED: {
		today: boolean;
		tomorrow: boolean;
		yesterday: boolean;
		nextBusinessDay: boolean;
		previousBusinessDay: boolean;
		specifiedDay: boolean;
		template: boolean;
		syntax: boolean;
	};
	TEMPLATE_TEXT: string;
	PERIOD_EVENT_INCLUDED: boolean;
};

const STORAGE_KEY = {
	SYNTAX: "syntax",
	CONTEXT_MENU_DISPLAYED: "contextMenuDisplayed",
	TEMPLATE_TEXT: "templateText",
	PERIOD_EVENT_INCLUDED: "periodEventIncluded",
} as const;

const STORAGE_INIT_VALUE: StorageValue = {
	SYNTAX: "html",
	CONTEXT_MENU_DISPLAYED: {
		today: true,
		tomorrow: false,
		yesterday: false,
		nextBusinessDay: false,
		previousBusinessDay: false,
		specifiedDay: false,
		template: true,
		syntax: true,
	},
	TEMPLATE_TEXT: "",
	PERIOD_EVENT_INCLUDED: false,
};

const VALID_SYNTAX_VALUES: StorageValue["SYNTAX"][] = [
	"html",
	"experimental-html",
	"markdown",
	"plainText",
];

const CONTEXT_MENU_DISPLAYED_KEYS: (keyof StorageValue["CONTEXT_MENU_DISPLAYED"])[] =
	[
		"today",
		"tomorrow",
		"yesterday",
		"nextBusinessDay",
		"previousBusinessDay",
		"specifiedDay",
		"template",
		"syntax",
	];

// 記法の設定

export const saveSyntaxSetting = async (syntax: StorageValue["SYNTAX"]) => {
	await chrome.storage.sync.set({ [STORAGE_KEY.SYNTAX]: syntax });
};

export const loadSyntaxSetting = async (): Promise<StorageValue["SYNTAX"]> => {
	const item = await chrome.storage.sync.get(STORAGE_KEY.SYNTAX);
	if (Object.keys(item).length === 0) {
		return STORAGE_INIT_VALUE.SYNTAX;
	}
	const raw = item[STORAGE_KEY.SYNTAX];
	if (!VALID_SYNTAX_VALUES.includes(raw)) {
		return STORAGE_INIT_VALUE.SYNTAX;
	}
	return raw;
};

// コンテキストメニューの表示設定

export const saveContextMenuDisplaySettings = async (
	displayed: StorageValue["CONTEXT_MENU_DISPLAYED"],
) => {
	await chrome.storage.sync.set({
		[STORAGE_KEY.CONTEXT_MENU_DISPLAYED]: displayed,
	});
};

export const loadContextMenuDisplaySettings = async (): Promise<
	StorageValue["CONTEXT_MENU_DISPLAYED"]
> => {
	const item = await chrome.storage.sync.get(
		STORAGE_KEY.CONTEXT_MENU_DISPLAYED,
	);
	if (Object.keys(item).length === 0) {
		return STORAGE_INIT_VALUE.CONTEXT_MENU_DISPLAYED;
	}
	const raw = item[STORAGE_KEY.CONTEXT_MENU_DISPLAYED];
	if (
		typeof raw !== "object" ||
		raw === null ||
		!CONTEXT_MENU_DISPLAYED_KEYS.every((key) => typeof raw[key] === "boolean")
	) {
		return STORAGE_INIT_VALUE.CONTEXT_MENU_DISPLAYED;
	}
	return raw as StorageValue["CONTEXT_MENU_DISPLAYED"];
};

// テンプレートの設定

export const saveTemplateText = async (text: StorageValue["TEMPLATE_TEXT"]) => {
	await chrome.storage.sync.set({ [STORAGE_KEY.TEMPLATE_TEXT]: text });
};

export const loadTemplateText = async (): Promise<
	StorageValue["TEMPLATE_TEXT"]
> => {
	const item = await chrome.storage.sync.get(STORAGE_KEY.TEMPLATE_TEXT);
	if (Object.keys(item).length === 0) {
		return STORAGE_INIT_VALUE.TEMPLATE_TEXT;
	}
	const raw = item[STORAGE_KEY.TEMPLATE_TEXT];
	if (typeof raw !== "string") {
		return STORAGE_INIT_VALUE.TEMPLATE_TEXT;
	}
	return raw;
};

// 期間予定を含めるかどうかの設定

export const savePeriodEventSetting = async (
	shown: StorageValue["PERIOD_EVENT_INCLUDED"],
) => {
	await chrome.storage.sync.set({ [STORAGE_KEY.PERIOD_EVENT_INCLUDED]: shown });
};

export const loadPeriodEventSetting = async (): Promise<
	StorageValue["PERIOD_EVENT_INCLUDED"]
> => {
	const item = await chrome.storage.sync.get(STORAGE_KEY.PERIOD_EVENT_INCLUDED);
	if (Object.keys(item).length === 0) {
		return STORAGE_INIT_VALUE.PERIOD_EVENT_INCLUDED;
	}
	const raw = item[STORAGE_KEY.PERIOD_EVENT_INCLUDED];
	if (typeof raw !== "boolean") {
		return STORAGE_INIT_VALUE.PERIOD_EVENT_INCLUDED;
	}
	return raw;
};
