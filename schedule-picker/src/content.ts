import { assert } from "console";

import { CONTEXT_MENU_ID } from "~contextMenus/builder";
import { ContextMenuController } from "~contextMenus/command/controller";
import { TodayCommand } from "~contextMenus/command/today";
import { TomorrowCommand } from "~contextMenus/command/tomorrow";
import { MESSAGE_CONTEXT, sendBuildContextMenu, type MessageContext } from "~messages";

(async () => {
  await sendBuildContextMenu();
})();

const contextMenuController = new ContextMenuController();
contextMenuController.setCommend(CONTEXT_MENU_ID.TODAY, new TodayCommand());
contextMenuController.setCommend(CONTEXT_MENU_ID.TOMORROW, new TomorrowCommand());

chrome.runtime.onMessage.addListener((message: MessageContext, _) => {
  if (message.context === MESSAGE_CONTEXT.CONTEXT_MENU_CLICKED) {
    const { tab, info } = message;
    assert(typeof info.menuItemId === "string");
    contextMenuController.action(info.menuItemId as string);
  }
});
