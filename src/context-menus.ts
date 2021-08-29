import browser from 'webextension-polyfill';

// https://developer.chrome.com/docs/extensions/reference/contextMenus/
type ContextType = 'editable';
type ItemType = 'normal';

export type ContextMenuItem = {
    id: string;
    title: string;
    parentId?: string;
    type: ItemType;
    contexts: ContextType[];
};

export const createContextMenu = (items: ContextMenuItem[]) => {
    for (const item of items) {
        browser.contextMenus.create(item);
    }
};

export const removeAllContextMenu = async () => browser.contextMenus.removeAll();
