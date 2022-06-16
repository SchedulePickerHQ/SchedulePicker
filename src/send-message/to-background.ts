import browser from 'webextension-polyfill';

export const MESSAGE_CONTEXT = {
    OPEN_SETTINGS_PAGE: 'OpenSettingsPage',
    BUILD_CONTEXT_MENU: 'BuildContextMenu',
} as const;

export type OpenSettingsPage = {
    context: typeof MESSAGE_CONTEXT.OPEN_SETTINGS_PAGE;
};

export type BuildContextMenu = {
    context: typeof MESSAGE_CONTEXT.BUILD_CONTEXT_MENU;
};

export type ToBackgroundMessage = OpenSettingsPage | BuildContextMenu;

export const openSettingsPage = async () => {
    await browser.runtime.sendMessage({ context: MESSAGE_CONTEXT.OPEN_SETTINGS_PAGE });
};

export const buildContextMenu = async () => {
    await browser.runtime.sendMessage({ context: MESSAGE_CONTEXT.BUILD_CONTEXT_MENU });
};
