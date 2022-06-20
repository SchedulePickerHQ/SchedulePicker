import { i18n } from 'webextension-polyfill';
import { addUUID } from '../util/uuid';

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

export const CONTEXT_MENU_ID = {
    ROOT: 'root',
    TODAY: 'today',
    TOMORROW: 'tomorrow',
    YESTERDAY: 'yesterday',
    NEXT_BUSINESS_DAY: 'nextBusinessDay',
    PREVIOUS_BUSINESS_DAY: 'previousBusinessDay',
    SPECIFIED_DAY: 'specifiedDay',
    TEMPLATE: 'template',
    MY_GROUP: 'myGroup',
    SETTINGS: 'settings',
    HTML: 'html',
    MARKDOWN: 'markdown',
    PLANE_TEXT: 'planeText',
    MYSELF: 'myself',
} as const;

export type ContextMenuId = TypeOfValues<typeof CONTEXT_MENU_ID>;

export class ContextMenuBuilder {
    items: ContextMenuItem[];

    constructor() {
        const root: ContextMenuItem = {
            id: CONTEXT_MENU_ID.ROOT,
            title: i18n.getMessage('ext_name'),
            type: 'normal',
            contexts: ['editable'],
        };
        this.items = [root];
    }

    addMenuItem(
        id: ContextMenuId | string,
        title: string,
        type: ItemType,
        options: {
            checked?: boolean;
            parentId?: ContextMenuId | string;
        },
    ) {
        const { checked, parentId } = options;
        this.items.push({
            id,
            title,
            type,
            checked,
            parentId: parentId ? parentId : CONTEXT_MENU_ID.ROOT,
            contexts: ['editable'],
        });
        return this;
    }

    addToday({ parentId }: { parentId: ContextMenuId | string }) {
        return this.addMenuItem(addUUID(CONTEXT_MENU_ID.TODAY), i18n.getMessage('context_menu_today'), 'normal', {
            parentId,
        });
    }

    addTomorrow({ parentId }: { parentId: ContextMenuId | string }) {
        return this.addMenuItem(addUUID(CONTEXT_MENU_ID.TOMORROW), i18n.getMessage('context_menu_tomorrow'), 'normal', {
            parentId,
        });
    }

    addYesterDay({ parentId }: { parentId: ContextMenuId | string }) {
        return this.addMenuItem(
            addUUID(CONTEXT_MENU_ID.YESTERDAY),
            i18n.getMessage('context_menu_yesterday'),
            'normal',
            { parentId },
        );
    }

    addNextBusinessDay({ parentId }: { parentId: ContextMenuId | string }) {
        return this.addMenuItem(
            addUUID(CONTEXT_MENU_ID.NEXT_BUSINESS_DAY),
            i18n.getMessage('context_menu_next_business_day'),
            'normal',
            { parentId },
        );
    }

    addPreviousBusinessDay({ parentId }: { parentId: ContextMenuId | string }) {
        return this.addMenuItem(
            addUUID(CONTEXT_MENU_ID.PREVIOUS_BUSINESS_DAY),
            i18n.getMessage('context_menu_previous_business_day'),
            'normal',
            {
                parentId,
            },
        );
    }

    addSpecifiedDay({ parentId }: { parentId: ContextMenuId | string }) {
        return this.addMenuItem(
            addUUID(CONTEXT_MENU_ID.SPECIFIED_DAY),
            i18n.getMessage('context_menu_specified_day'),
            'normal',
            { parentId },
        );
    }

    addTemplate({ parentId }: { parentId: ContextMenuId | string }) {
        return this.addMenuItem(addUUID(CONTEXT_MENU_ID.TEMPLATE), i18n.getMessage('context_menu_template'), 'normal', {
            parentId,
        });
    }

    addMyself() {
        return this.addMenuItem(CONTEXT_MENU_ID.MYSELF, i18n.getMessage('context_menu_myself'), 'normal', {});
    }

    addUpdateMyGroup() {
        return this.addMenuItem(CONTEXT_MENU_ID.MY_GROUP, i18n.getMessage('context_menu_mygroup'), 'normal', {});
    }

    addSettings() {
        return this.addMenuItem(CONTEXT_MENU_ID.SETTINGS, i18n.getMessage('context_menu_settings'), 'normal', {});
    }

    addHtml({ checked = false }) {
        return this.addMenuItem(CONTEXT_MENU_ID.HTML, i18n.getMessage('context_menu_html'), 'radio', { checked });
    }

    addMarkdown({ checked = false }) {
        return this.addMenuItem(CONTEXT_MENU_ID.MARKDOWN, i18n.getMessage('context_menu_markdown'), 'radio', {
            checked,
        });
    }

    addPlaneText({ checked = false }) {
        return this.addMenuItem(CONTEXT_MENU_ID.PLANE_TEXT, i18n.getMessage('context_menu_plane_text'), 'radio', {
            checked,
        });
    }

    build() {
        return this.items;
    }
}
