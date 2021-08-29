import { createContextMenu, removeAllContextMenu } from './contextMenus/context-menus';
import { ContextMenuBuilder } from './contextMenus/context-menu-builder';

(async () => {
    await removeAllContextMenu();
    const builder = new ContextMenuBuilder();
    const items = builder.addToday().addTemplate().addSettings().build();
    createContextMenu(items);
})();
