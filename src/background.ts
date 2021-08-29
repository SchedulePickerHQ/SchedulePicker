import { createContextMenu, removeAllContextMenu } from './context-menus';
import { ContextMenuBuilder } from './context-menu-builder';

(async () => {
    await removeAllContextMenu();
    const builder = new ContextMenuBuilder();
    const items = builder.addToday().addTemplate().addSettings().build();
    createContextMenu(items);
})();
