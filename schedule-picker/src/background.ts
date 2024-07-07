import { buildContextMenu } from "~usecase/contextMenus/builder";
import { MESSAGE_CONTEXT, sendContextMenuClicked, type MessageContext } from "~utils/messages";

chrome.contextMenus.onClicked.addListener(async (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
  if (tab?.id === undefined) {
    return;
  }
  await sendContextMenuClicked(tab.id, info, tab);
});

chrome.runtime.onMessage.addListener(async (message: MessageContext, _) => {
  if (message.context === MESSAGE_CONTEXT.OPEN_SETTINGS_PAGE) {
    await chrome.runtime.openOptionsPage();
  } else if (message.context === MESSAGE_CONTEXT.BUILD_CONTEXT_MENU) {
    await buildContextMenu();
  }
});
