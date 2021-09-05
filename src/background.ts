import browser from 'webextension-polyfill';
import { ActionFactory } from './actions/action-factory';
import { ContextMenuBuilder } from './contextMenus/context-menu-builder';
import { createContextMenu, removeAllContextMenu } from './contextMenus/context-menus';

(async () => {
    await removeAllContextMenu();
    const builder = new ContextMenuBuilder();
    const items = builder.addToday().addTemplate().addSettings().build();
    createContextMenu(items);
})();

browser.contextMenus.onClicked.addListener(async (info: browser.Menus.OnClickData, tab?: browser.Tabs.Tab) => {
    if (tab?.id === undefined) {
        return;
    }

    const action = new ActionFactory().create(info.menuItemId);
    action.execute(info, tab);
});
