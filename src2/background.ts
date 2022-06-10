import browser from 'webextension-polyfill';
import { buildContextMenu } from './content/context-menu/operation';
import { sendContextMenuClicked } from './content/message';

(async () => {
    await buildContextMenu();
})();

browser.contextMenus.onClicked.addListener(async (info: browser.Menus.OnClickData, tab?: browser.Tabs.Tab) => {
    await sendContextMenuClicked(info, tab);
});
