import browser from 'webextension-polyfill';
import { CommandFactory } from './commands/command-factory';
import { buildContextMenu } from './contextMenus/context-menus';
import { assert } from './utils/asserts';
import { isString } from './utils/type-check';
import { clearUUID } from './utils/uuid';

(async () => {
    await buildContextMenu();
})();

browser.contextMenus.onClicked.addListener(async (info: browser.Menus.OnClickData, tab?: browser.Tabs.Tab) => {
    if (tab?.id === undefined && tab?.url === undefined) {
        return;
    }

    assert(isString(info.menuItemId));
    const command = new CommandFactory().create(clearUUID(info.menuItemId));
    command.execute(info, tab);
});
