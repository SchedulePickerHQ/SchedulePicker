import browser from 'webextension-polyfill';

// https://developer.chrome.com/docs/extensions/reference/contextMenus/
type ContextType = 'editable';
export type ItemType = 'normal' | 'radio';

export type ContextMenuItem = {
    id: string;
    title: string;
    type: ItemType;
    checked?: boolean;
    parentId?: string;
    contexts: ContextType[];
};

export const createContextMenu = (items: ContextMenuItem[]) => {
    for (const item of items) {
        browser.contextMenus.create(item);
    }
};

export const removeAllContextMenu = async () => browser.contextMenus.removeAll();
