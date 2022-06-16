import browser from 'webextension-polyfill';

export const MESSAGE_CONTEXT = {
    OPEN_SETTINGS_PAGE: 'OpenSettingsPage',
} as const;

export type OpenSettingsPage = {
    context: typeof MESSAGE_CONTEXT.OPEN_SETTINGS_PAGE;
};

export type ToBackgroundMessage = OpenSettingsPage;

export const openSettingsPage = async () => {
    await browser.runtime.sendMessage({ context: MESSAGE_CONTEXT.OPEN_SETTINGS_PAGE });
};
