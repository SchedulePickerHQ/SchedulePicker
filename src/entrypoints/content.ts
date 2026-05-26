import { HtmlCommand } from "../insert/commands/html";
import { MarkdownCommand } from "../insert/commands/markdown";
import { NextBusinessDayCommand } from "../insert/commands/nextBusinessDay";
import { PlainTextCommand } from "../insert/commands/plainText";
import { PreviousBusinessDayCommand } from "../insert/commands/previousBusinessDay";
import { SettingsCommand } from "../insert/commands/settings";
import { SpecifiedDayCommand } from "../insert/commands/specifiedDay";
import { TemplateCommand } from "../insert/commands/template";
import { TodayCommand } from "../insert/commands/today";
import { TomorrowCommand } from "../insert/commands/tomorrow";
import { YesterdayCommand } from "../insert/commands/yesterday";
import { CONTEXT_MENU_ID } from "../menu/builder";
import { ContextMenuController } from "../menu/controller";
import {
	MESSAGE_CONTEXT,
	type MessageContext,
	sendBuildContextMenu,
} from "../utils/messaging";

(async () => {
	await sendBuildContextMenu();
})();

const contextMenuController = new ContextMenuController();
contextMenuController.setCommand(CONTEXT_MENU_ID.TODAY, new TodayCommand());
contextMenuController.setCommand(
	CONTEXT_MENU_ID.TOMORROW,
	new TomorrowCommand(),
);
contextMenuController.setCommand(
	CONTEXT_MENU_ID.YESTERDAY,
	new YesterdayCommand(),
);
contextMenuController.setCommand(
	CONTEXT_MENU_ID.NEXT_BUSINESS_DAY,
	new NextBusinessDayCommand(),
);
contextMenuController.setCommand(
	CONTEXT_MENU_ID.PREVIOUS_BUSINESS_DAY,
	new PreviousBusinessDayCommand(),
);
contextMenuController.setCommand(
	CONTEXT_MENU_ID.SPECIFIED_DAY,
	new SpecifiedDayCommand(),
);
contextMenuController.setCommand(
	CONTEXT_MENU_ID.TEMPLATE,
	new TemplateCommand(),
);
contextMenuController.setCommand(CONTEXT_MENU_ID.HTML, new HtmlCommand());
contextMenuController.setCommand(
	CONTEXT_MENU_ID.MARKDOWN,
	new MarkdownCommand(),
);
contextMenuController.setCommand(
	CONTEXT_MENU_ID.PLAIN_TEXT,
	new PlainTextCommand(),
);
contextMenuController.setCommand(
	CONTEXT_MENU_ID.SETTINGS,
	new SettingsCommand(),
);

chrome.runtime.onMessage.addListener((message: MessageContext, _) => {
	if (message.context === MESSAGE_CONTEXT.CONTEXT_MENU_CLICKED) {
		const { info } = message;
		contextMenuController.handleClick(info.menuItemId.toString());
	}
});
