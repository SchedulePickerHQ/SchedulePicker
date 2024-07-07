export const MESSAGE_CONTEXT = {
  CONTEXT_MENU_CLICKED: "CONTEXT_MENU_CLICKED",
  OPEN_SETTINGS_PAGE: "OPEN_SETTINGS_PAGE",
  BUILD_CONTEXT_MENU: "BUILD_CONTEXT_MENU"
} as const;

type SendContextMenuClicked = {
  context: typeof MESSAGE_CONTEXT.CONTEXT_MENU_CLICKED;
  info: chrome.contextMenus.OnClickData;
  tab: chrome.tabs.Tab;
};

export const sendContextMenuClicked = async (
  tabId: number,
  info: chrome.contextMenus.OnClickData,
  tab: chrome.tabs.Tab
) => {
  await chrome.tabs.sendMessage(tabId, { context: MESSAGE_CONTEXT.CONTEXT_MENU_CLICKED, info, tab });
};

type SendOpenSettingsPage = {
  context: typeof MESSAGE_CONTEXT.OPEN_SETTINGS_PAGE;
};

export const sendOpenSettingsPage = async () => {
  await chrome.runtime.sendMessage({ context: MESSAGE_CONTEXT.OPEN_SETTINGS_PAGE });
};

type SendBuildContextMenu = {
  context: typeof MESSAGE_CONTEXT.BUILD_CONTEXT_MENU;
};

export const sendBuildContextMenu = async () => {
  await chrome.runtime.sendMessage({ context: MESSAGE_CONTEXT.BUILD_CONTEXT_MENU });
};

export type MessageContext = SendContextMenuClicked | SendOpenSettingsPage | SendBuildContextMenu;
