import browser from 'webextension-polyfill';
import { getSyntax } from './storage/storage';
import { ActionFactory } from './actions/action-factory';
import { ContextMenuBuilder } from './contextMenus/context-menu-builder';
import { createContextMenu, removeAllContextMenu } from './contextMenus/context-menus';

(async () => {
    await removeAllContextMenu();
    const syntax = await getSyntax();
    const htmlSelected = syntax === 'html';
    const markdownSelected = syntax === 'markdown';
    const items = new ContextMenuBuilder()
        .addToday()
        .addNextBusinessDay()
        .addHtml(htmlSelected)
        .addMarkdown(markdownSelected)
        .addSettings()
        .build();
    createContextMenu(items);
})();

browser.contextMenus.onClicked.addListener(async (info: browser.Menus.OnClickData, tab?: browser.Tabs.Tab) => {
    if (tab?.id === undefined && tab?.url === undefined) {
        return;
    }

    const action = new ActionFactory().create(info.menuItemId);
    action.execute(info, tab);
});
