import browser from 'webextension-polyfill';

export const MESSAGE_CONTEXT = {
    CONTEXT_MENU_CLICKED: 'ContextMenuClicked',
    ERROR: 'Error',
} as const;

export type MessageContext = TypeOfValues<typeof MESSAGE_CONTEXT>;

export type ContextMenuMessage = {
    context: MessageContext;
    info: browser.Menus.OnClickData;
    tab: browser.Tabs.Tab;
};

export const sendContextMenuClicked = async (info: browser.Menus.OnClickData, tab?: browser.Tabs.Tab) => {
    if (tab === undefined || tab.id === undefined) {
        return;
    }
    await browser.tabs.sendMessage(tab.id, { context: MESSAGE_CONTEXT.CONTEXT_MENU_CLICKED, info, tab });
};
