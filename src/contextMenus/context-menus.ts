import browser from 'webextension-polyfill';
import { getSyntax } from '../storage/storage';
import { ContextMenuBuilder, ContextMenuItem } from './context-menu-builder';

const createContextMenu = (items: ContextMenuItem[]) => {
    for (const item of items) {
        browser.contextMenus.create(item);
    }
};

const removeAllContextMenu = async () => browser.contextMenus.removeAll();

export const buildContextMenu = async () => {
    await removeAllContextMenu();
    const syntax = await getSyntax();
    const htmlSelected = syntax === 'html';
    const markdownSelected = syntax === 'markdown';
    const items = new ContextMenuBuilder()
        .addToday()
        .addNextBusinessDay()
        .addHtml(htmlSelected)
        .addMarkdown(markdownSelected)
        .addSettings()
        .build();
    createContextMenu(items);
};
