import { buildContextMenu } from "../menu/builder";
import {
	MESSAGE_CONTEXT,
	type MessageContext,
	sendContextMenuClicked,
} from "../utils/messaging";

// Service Worker 停止後はメニュー状態が失われるため、起動契機ごとに再構築する
chrome.runtime.onInstalled.addListener(async () => {
	await buildContextMenu();
});
chrome.runtime.onStartup.addListener(async () => {
	await buildContextMenu();
});

chrome.contextMenus.onClicked.addListener(
	async (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
		if (tab?.id === undefined) {
			return;
		}
		try {
			await sendContextMenuClicked(tab.id, info, tab);
		} catch {
			// content script が未ロードのタブでは接続できないため無視する
		}
	},
);

chrome.runtime.onMessage.addListener(async (message: MessageContext, _) => {
	if (message.context === MESSAGE_CONTEXT.OPEN_SETTINGS_PAGE) {
		await chrome.runtime.openOptionsPage();
	} else if (message.context === MESSAGE_CONTEXT.BUILD_CONTEXT_MENU) {
		await buildContextMenu();
	}
});
