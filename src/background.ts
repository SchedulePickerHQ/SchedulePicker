import browser from 'webextension-polyfill';
import { buildContextMenu } from './context-menu/operation';
import { MESSAGE_CONTEXT, ToBackgroundMessage } from './send-message/to-background';
import { contextMenuClicked } from './send-message/to-content';

browser.contextMenus.onClicked.addListener(async (info: browser.Menus.OnClickData, tab?: browser.Tabs.Tab) => {
    if (tab?.id === undefined) {
        return;
    }
    await contextMenuClicked(tab.id, info, tab);
});

browser.runtime.onMessage.addListener(async (message: ToBackgroundMessage, _) => {
    if (message.context === MESSAGE_CONTEXT.OPEN_SETTINGS_PAGE) {
        await browser.runtime.openOptionsPage();
    } else if (message.context === MESSAGE_CONTEXT.BUILD_CONTEXT_MENU) {
        await buildContextMenu();
    }
});
