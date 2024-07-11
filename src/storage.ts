type StorageValue = {
  SYNTAX: "html" | "markdown" | "planeText";
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
  PERIOD_EVENT_INCLUDED: "periodEventIncluded"
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
    syntax: true
  },
  TEMPLATE_TEXT: "",
  PERIOD_EVENT_INCLUDED: false
};

// 記法の設定

export const saveSyntaxSetting = async (syntax: StorageValue["SYNTAX"]) => {
  await chrome.storage.sync.set({ [STORAGE_KEY.SYNTAX]: syntax });
};

export const loadSyntaxSetting = async (): Promise<StorageValue["SYNTAX"]> => {
  const item = await chrome.storage.sync.get(STORAGE_KEY.SYNTAX);

  if (Object.keys(item).length === 0) {
    return STORAGE_INIT_VALUE.SYNTAX;
  }

  return item[STORAGE_KEY.SYNTAX] as StorageValue["SYNTAX"];
};

// コンテキストメニューの表示設定

export const saveContextMenuDisplaySettings = async (displayed: StorageValue["CONTEXT_MENU_DISPLAYED"]) => {
  await chrome.storage.sync.set({ [STORAGE_KEY.CONTEXT_MENU_DISPLAYED]: displayed });
};

export const loadContextMenuDisplaySettings = async (): Promise<StorageValue["CONTEXT_MENU_DISPLAYED"]> => {
  const item = await chrome.storage.sync.get(STORAGE_KEY.CONTEXT_MENU_DISPLAYED);

  if (Object.keys(item).length === 0) {
    return STORAGE_INIT_VALUE.CONTEXT_MENU_DISPLAYED;
  }

  return item[STORAGE_KEY.CONTEXT_MENU_DISPLAYED] as StorageValue["CONTEXT_MENU_DISPLAYED"];
};

// テンプレートの設定

export const saveTemplateText = async (text: StorageValue["TEMPLATE_TEXT"]) => {
  await chrome.storage.sync.set({ [STORAGE_KEY.TEMPLATE_TEXT]: text });
};

export const loadTemplateText = async (): Promise<StorageValue["TEMPLATE_TEXT"]> => {
  const item = await chrome.storage.sync.get(STORAGE_KEY.TEMPLATE_TEXT);

  if (Object.keys(item).length === 0) {
    return STORAGE_INIT_VALUE.TEMPLATE_TEXT;
  }

  return item[STORAGE_KEY.TEMPLATE_TEXT] as StorageValue["TEMPLATE_TEXT"];
};

// 期間予定を含めるかどうかの設定

export const savePeriodEventIncludedSetting = async (shown: StorageValue["PERIOD_EVENT_INCLUDED"]) => {
  await chrome.storage.sync.set({ [STORAGE_KEY.PERIOD_EVENT_INCLUDED]: shown });
};

export const loadPeriodEventIncludedSetting = async (): Promise<StorageValue["PERIOD_EVENT_INCLUDED"]> => {
  const item = await chrome.storage.sync.get(STORAGE_KEY.PERIOD_EVENT_INCLUDED);

  if (Object.keys(item).length === 0) {
    return STORAGE_INIT_VALUE.PERIOD_EVENT_INCLUDED;
  }

  return item[STORAGE_KEY.PERIOD_EVENT_INCLUDED] as StorageValue["PERIOD_EVENT_INCLUDED"];
};
