import { assert } from "console";

import { TodayCommand } from "~/menu/command/today";
import { CONTEXT_MENU_ID } from "~menu/builder";
import { ContextMenuController } from "~menu/command/controller";
import { TomorrowCommand } from "~menu/command/tomorrow";
import { MESSAGE_CONTEXT, sendBuildContextMenu, type MessageContext } from "~utils/messages";

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
