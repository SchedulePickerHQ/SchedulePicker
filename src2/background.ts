import browser from 'webextension-polyfill';
import { buildContextMenu } from './context-menu/operation';
import { sendContextMenuClicked } from './send-message/to-content';

(async () => {
    await buildContextMenu();
})();

browser.contextMenus.onClicked.addListener(async (info: browser.Menus.OnClickData, tab?: browser.Tabs.Tab) => {
    if (tab?.id === undefined) {
        return;
    }
    await sendContextMenuClicked(tab.id, info, tab);
});
