import { TodayCommand } from "~/menu/command/today";
import { CONTEXT_MENU_ID } from "~menu/builder";
import { HTMLCommand } from "~menu/command/html";
import { MarkdownCommand } from "~menu/command/markdown";
import { NextBusinessDayCommand } from "~menu/command/nextBusinessDay";
import { PlaneTextCommand } from "~menu/command/planeText";
import { PreviousBusinessDayCommand } from "~menu/command/previousBusinessDay";
import { SettingsCommand } from "~menu/command/settings";
import { SpecifiedDayCommand } from "~menu/command/specifiedDay";
import { TemplateCommand } from "~menu/command/template";
import { TomorrowCommand } from "~menu/command/tomorrow";
import { YesterdayCommand } from "~menu/command/yesterday";
import { ContextMenuController } from "~menu/controller";
import { MESSAGE_CONTEXT, sendBuildContextMenu, type MessageContext } from "~messages";

(async () => {
  await sendBuildContextMenu();
})();

const contextMenuController = new ContextMenuController();
contextMenuController.setCommend(CONTEXT_MENU_ID.TODAY, new TodayCommand());
contextMenuController.setCommend(CONTEXT_MENU_ID.TOMORROW, new TomorrowCommand());
contextMenuController.setCommend(CONTEXT_MENU_ID.YESTERDAY, new YesterdayCommand());
contextMenuController.setCommend(CONTEXT_MENU_ID.NEXT_BUSINESS_DAY, new NextBusinessDayCommand());
contextMenuController.setCommend(CONTEXT_MENU_ID.PREVIOUS_BUSINESS_DAY, new PreviousBusinessDayCommand());
contextMenuController.setCommend(CONTEXT_MENU_ID.SPECIFIED_DAY, new SpecifiedDayCommand());
contextMenuController.setCommend(CONTEXT_MENU_ID.TEMPLATE, new TemplateCommand());
contextMenuController.setCommend(CONTEXT_MENU_ID.HTML, new HTMLCommand());
contextMenuController.setCommend(CONTEXT_MENU_ID.MARKDOWN, new MarkdownCommand());
contextMenuController.setCommend(CONTEXT_MENU_ID.PLANE_TEXT, new PlaneTextCommand());
contextMenuController.setCommend(CONTEXT_MENU_ID.SETTINGS, new SettingsCommand());

chrome.runtime.onMessage.addListener((message: MessageContext, _) => {
  if (message.context === MESSAGE_CONTEXT.CONTEXT_MENU_CLICKED) {
    const { info } = message;
    contextMenuController.clicked(info.menuItemId.toString());
  }
});
