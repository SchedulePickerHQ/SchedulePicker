import browser from 'webextension-polyfill';
import { CommandFactory } from './commands/command-factory';
import { buildContextMenu } from './contextMenus/context-menus';

(async () => {
    await buildContextMenu();
})();

browser.contextMenus.onClicked.addListener(async (info: browser.Menus.OnClickData, tab?: browser.Tabs.Tab) => {
    if (tab?.id === undefined && tab?.url === undefined) {
        return;
    }

    const command = new CommandFactory().create(info.menuItemId);
    command.execute(info, tab);
});
