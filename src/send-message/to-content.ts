import browser, { Menus, Tabs } from 'webextension-polyfill';

export const MESSAGE_CONTEXT = {
    CONTEXT_MENU_CLICKED: 'ContextMenuClicked',
} as const;

export type ContextMenuClicked = {
    context: typeof MESSAGE_CONTEXT.CONTEXT_MENU_CLICKED;
    info: browser.Menus.OnClickData;
    tab: browser.Tabs.Tab;
};

export type ToContentMessage = ContextMenuClicked;

export const contextMenuClicked = async (tabId: number, info: Menus.OnClickData, tab: Tabs.Tab) => {
    await browser.tabs.sendMessage(tabId, { context: MESSAGE_CONTEXT.CONTEXT_MENU_CLICKED, info, tab });
};
