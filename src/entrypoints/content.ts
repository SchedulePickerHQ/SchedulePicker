import { ScheduleCommand } from "../insert/commands/scheduleCommand";
import { SettingsCommand } from "../insert/commands/settingsCommand";
import { SpecifiedDayCommand } from "../insert/commands/specifiedDayCommand";
import { DecorationCommand } from "../insert/commands/decorationCommand";
import { TemplateCommand } from "../insert/commands/templateCommand";
import type { ScheduleDeps } from "../insert/commands/types";
import { paste } from "../insert/paste";
import { CONTEXT_MENU_ID } from "../menu/builder";
import { ContextMenuController } from "../menu/controller";
import {
	getNextBusinessDay,
	getPreviousBusinessDay,
} from "../schedule/businessDay";
import { getUserEvents } from "../schedule/events";
import { createFormatter } from "../syntax/formatter";
import { createBrowserApi } from "../utils/browser";
import { dateTime, getDayOfWeek } from "../utils/datetime";
import {
	MESSAGE_CONTEXT,
	type MessageContext,
	sendBuildContextMenu,
	sendOpenSettingsPage,
} from "../utils/messaging";
import {
	loadPeriodEventSetting,
	loadDecorationSetting,
	loadTemplateText,
	saveDecorationSetting,
} from "../utils/storage";

(async () => {
	await sendBuildContextMenu();
})();

const env = createBrowserApi();

const makeScheduleDeps = (
	resolveDate: ScheduleDeps["resolveDate"],
): ScheduleDeps => ({
	env,
	resolveDate,
	loadPeriodEventSetting,
	loadDecorationSetting,
	createFormatter,
	getUserEvents,
	paste,
});

const contextMenuController = new ContextMenuController();

contextMenuController.setCommand(
	CONTEXT_MENU_ID.TODAY,
	new ScheduleCommand(makeScheduleDeps(() => dateTime())),
);
contextMenuController.setCommand(
	CONTEXT_MENU_ID.TOMORROW,
	new ScheduleCommand(makeScheduleDeps(() => dateTime().add(1, "day"))),
);
contextMenuController.setCommand(
	CONTEXT_MENU_ID.YESTERDAY,
	new ScheduleCommand(makeScheduleDeps(() => dateTime().subtract(1, "day"))),
);
contextMenuController.setCommand(
	CONTEXT_MENU_ID.NEXT_BUSINESS_DAY,
	new ScheduleCommand(makeScheduleDeps(() => getNextBusinessDay(env.hostname))),
);
contextMenuController.setCommand(
	CONTEXT_MENU_ID.PREVIOUS_BUSINESS_DAY,
	new ScheduleCommand(
		makeScheduleDeps(() => getPreviousBusinessDay(env.hostname)),
	),
);
contextMenuController.setCommand(
	CONTEXT_MENU_ID.SPECIFIED_DAY,
	new SpecifiedDayCommand({
		env,
		loadPeriodEventSetting,
		loadDecorationSetting,
		createFormatter,
		getUserEvents,
		paste,
	}),
);
contextMenuController.setCommand(
	CONTEXT_MENU_ID.TEMPLATE,
	new TemplateCommand({
		env,
		loadTemplateText,
		loadPeriodEventSetting,
		loadDecorationSetting,
		createFormatter,
		getUserEvents,
		paste,
		getNextBusinessDay,
		getPreviousBusinessDay,
		getDayOfWeek,
	}),
);
contextMenuController.setCommand(
	CONTEXT_MENU_ID.STYLED,
	new DecorationCommand("styled", { saveDecorationSetting, sendBuildContextMenu }),
);
contextMenuController.setCommand(
	CONTEXT_MENU_ID.MINIMAL,
	new DecorationCommand("minimal", {
		saveDecorationSetting,
		sendBuildContextMenu,
	}),
);
contextMenuController.setCommand(
	CONTEXT_MENU_ID.PLAIN,
	new DecorationCommand("plain", { saveDecorationSetting, sendBuildContextMenu }),
);
contextMenuController.setCommand(
	CONTEXT_MENU_ID.SETTINGS,
	new SettingsCommand({ sendOpenSettingsPage }),
);

chrome.runtime.onMessage.addListener((message: MessageContext, _) => {
	if (message.context === MESSAGE_CONTEXT.CONTEXT_MENU_CLICKED) {
		const { info } = message;
		contextMenuController.handleClick(info.menuItemId.toString());
	}
});
