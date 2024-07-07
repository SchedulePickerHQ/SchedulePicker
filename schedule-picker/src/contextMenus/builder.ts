import { loadContextMenuDisplaySettings, loadSyntaxSetting } from "~storage";

// https://developer.chrome.com/docs/extensions/reference/contextMenus/
type ContextMenuItem = {
  id: string;
  title: string;
  type: "normal" | "radio";
  checked?: boolean;
  parentId?: string;
  contexts: "editable"[];
};

type ContextMenuId = TypeOfValues<typeof CONTEXT_MENU_ID>;

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
  HTML: "HTML",
  MARKDOWN: "MARKDOWN",
  PLANE_TEXT: "PLANE_TEXT"
} as const;

export class ContextMenuBuilder {
  items: ContextMenuItem[];

  constructor() {
    const root: ContextMenuItem = {
      id: CONTEXT_MENU_ID.ROOT,
      title: chrome.i18n.getMessage("ext_name"),
      type: "normal",
      contexts: ["editable"]
    };
    this.items = [root];
  }

  addMenuItem(
    id: ContextMenuId,
    title: string,
    type: "normal" | "radio",
    options?: {
      checked?: boolean;
    }
  ) {
    this.items.push({
      id,
      title,
      type,
      checked: options?.checked ?? false,
      parentId: CONTEXT_MENU_ID.ROOT,
      contexts: ["editable"]
    });
    return this;
  }

  addToday() {
    return this.addMenuItem(CONTEXT_MENU_ID.TODAY, chrome.i18n.getMessage("context_menu_today"), "normal");
  }

  addTomorrow() {
    return this.addMenuItem(CONTEXT_MENU_ID.TOMORROW, chrome.i18n.getMessage("context_menu_tomorrow"), "normal");
  }

  addYesterDay() {
    return this.addMenuItem(CONTEXT_MENU_ID.YESTERDAY, chrome.i18n.getMessage("context_menu_yesterday"), "normal");
  }

  addNextBusinessDay() {
    return this.addMenuItem(
      CONTEXT_MENU_ID.NEXT_BUSINESS_DAY,
      chrome.i18n.getMessage("context_menu_next_business_day"),
      "normal"
    );
  }

  addPreviousBusinessDay() {
    return this.addMenuItem(
      CONTEXT_MENU_ID.PREVIOUS_BUSINESS_DAY,
      chrome.i18n.getMessage("context_menu_previous_business_day"),
      "normal"
    );
  }

  addSpecifiedDay() {
    return this.addMenuItem(
      CONTEXT_MENU_ID.SPECIFIED_DAY,
      chrome.i18n.getMessage("context_menu_specified_day"),
      "normal"
    );
  }

  addTemplate() {
    return this.addMenuItem(CONTEXT_MENU_ID.TEMPLATE, chrome.i18n.getMessage("context_menu_template"), "normal");
  }

  addSettings() {
    return this.addMenuItem(CONTEXT_MENU_ID.SETTINGS, chrome.i18n.getMessage("context_menu_settings"), "normal", {});
  }

  addHtml({ checked = false }) {
    return this.addMenuItem(CONTEXT_MENU_ID.HTML, chrome.i18n.getMessage("context_menu_html"), "radio", { checked });
  }

  addMarkdown({ checked = false }) {
    return this.addMenuItem(CONTEXT_MENU_ID.MARKDOWN, chrome.i18n.getMessage("context_menu_markdown"), "radio", {
      checked
    });
  }

  addPlaneText({ checked = false }) {
    return this.addMenuItem(CONTEXT_MENU_ID.PLANE_TEXT, chrome.i18n.getMessage("context_menu_plane_text"), "radio", {
      checked
    });
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
    builder.addYesterDay();
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

  if (contextMenuDisplaySettings.syntax) {
    const syntax = await loadSyntaxSetting();
    builder.addHtml({ checked: syntax === "html" });
    builder.addMarkdown({ checked: syntax === "markdown" });
    builder.addPlaneText({ checked: syntax === "planeText" });
  }

  builder.addSettings();

  const items = builder.build();

  for (const item of items) {
    chrome.contextMenus.create(item);
  }
};
