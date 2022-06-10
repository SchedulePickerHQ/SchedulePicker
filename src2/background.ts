import browser from 'webextension-polyfill';
import { buildContextMenu } from './content/context-menu/operation';

(async () => {
    await buildContextMenu();
})();

// browser.contextMenus.onClicked.addListener(async (info: browser.Menus.OnClickData, tab?: browser.Tabs.Tab) => {
browser.contextMenus.onClicked.addListener(async (info: browser.Menus.OnClickData) => {
    console.log(info.menuItemId);
});
