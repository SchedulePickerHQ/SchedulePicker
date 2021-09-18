import browser from 'webextension-polyfill';
import { ActionFactory } from './actions/base/action-factory';
import { buildContextMenu } from './contextMenus/context-menus';

(async () => {
    await buildContextMenu();
})();

browser.contextMenus.onClicked.addListener(async (info: browser.Menus.OnClickData, tab?: browser.Tabs.Tab) => {
    if (tab?.id === undefined && tab?.url === undefined) {
        return;
    }

    const action = new ActionFactory().create(info.menuItemId);
    action.execute(info, tab);
});
