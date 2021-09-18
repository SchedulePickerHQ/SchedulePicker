import browser from 'webextension-polyfill';
import { getSyntax, getContextMenuDisplayed } from '../storage/storage';
import { ContextMenuBuilder, ContextMenuItem } from './context-menu-builder';

const createContextMenu = (items: ContextMenuItem[]) => {
    for (const item of items) {
        browser.contextMenus.create(item);
    }
};

const removeAllContextMenu = async () => browser.contextMenus.removeAll();

export const buildContextMenu = async () => {
    await removeAllContextMenu();
    const builder = new ContextMenuBuilder();
    const display = await getContextMenuDisplayed();

    if (display.today) {
        builder.addToday();
    }

    if (display.tomorrow) {
        builder.addTomorrow();
    }

    if (display.yesterday) {
        builder.addYesterDay();
    }

    if (display.nextBusinessDay) {
        builder.addNextBusinessDay();
    }

    if (display.previousBusinessDay) {
        builder.addPreviousBusinessDay();
    }

    if (display.specifiedDay) {
        builder.addSpecifiedDay();
    }

    if (display.template) {
        builder.addTemplate();
    }

    if (display.syntax) {
        const syntax = await getSyntax();
        builder.addHtml(syntax === 'html');
        builder.addMarkdown(syntax === 'markdown');
    }

    builder.addSettings();
    createContextMenu(builder.build());
};
