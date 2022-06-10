import browser from 'webextension-polyfill';
import {
    ContextMenuDisplayed,
    getContextMenuDisplayed,
    getMyGroups,
    getSyntax,
    getToUseMyGroup,
} from '../storage/storage';
import { ContextMenuBuilder, ContextMenuId, ContextMenuItem, CONTEXT_MENU_ID } from './context-menu-builder';

const createContextMenu = (items: ContextMenuItem[]) => {
    for (const item of items) {
        browser.contextMenus.create(item);
    }
};

const removeAllContextMenu = async () => browser.contextMenus.removeAll();

export const buildContextMenu = async () => {
    const builder = new ContextMenuBuilder();
    const display = await getContextMenuDisplayed();
    const useMyGroup = await getToUseMyGroup();

    if (useMyGroup) {
        const myGroups = await getMyGroups();
        builder.addMyself();
        addEventMenu(builder, display, CONTEXT_MENU_ID.MYSELF);

        for (const myGroup of myGroups) {
            builder.addMenuItem(myGroup.key, myGroup.name, 'normal', { parentId: CONTEXT_MENU_ID.ROOT });
            addEventMenu(builder, display, myGroup.key);
        }
    } else {
        addEventMenu(builder, display, CONTEXT_MENU_ID.ROOT);
    }

    if (display.syntax) {
        const syntax = await getSyntax();
        builder.addHtml({ checked: syntax === 'html' });
        builder.addMarkdown({ checked: syntax === 'markdown' });
    }

    if (useMyGroup) {
        builder.addUpdateMyGroup();
    }

    builder.addSettings();
    await removeAllContextMenu();
    createContextMenu(builder.build());
};

const addEventMenu = (builder: ContextMenuBuilder, display: ContextMenuDisplayed, parentId: ContextMenuId | string) => {
    if (display.today) {
        builder.addToday({ parentId });
    }

    if (display.tomorrow) {
        builder.addTomorrow({ parentId });
    }

    if (display.yesterday) {
        builder.addYesterDay({ parentId });
    }

    if (display.nextBusinessDay) {
        builder.addNextBusinessDay({ parentId });
    }

    if (display.previousBusinessDay) {
        builder.addPreviousBusinessDay({ parentId });
    }

    if (display.specifiedDay) {
        builder.addSpecifiedDay({ parentId });
    }

    if (display.template) {
        builder.addTemplate({ parentId });
    }
};
