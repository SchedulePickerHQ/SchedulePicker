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
            title: 'SchedulePicker',
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
        return this.addMenuItem(addUUID(CONTEXT_MENU_ID.TODAY), '今日の予定', 'normal', { parentId });
    }

    addTomorrow({ parentId }: { parentId: ContextMenuId | string }) {
        return this.addMenuItem(addUUID(CONTEXT_MENU_ID.TOMORROW), '明日の予定', 'normal', { parentId });
    }

    addYesterDay({ parentId }: { parentId: ContextMenuId | string }) {
        return this.addMenuItem(addUUID(CONTEXT_MENU_ID.YESTERDAY), '昨日の予定', 'normal', { parentId });
    }

    addNextBusinessDay({ parentId }: { parentId: ContextMenuId | string }) {
        return this.addMenuItem(addUUID(CONTEXT_MENU_ID.NEXT_BUSINESS_DAY), '翌営業日の予定', 'normal', { parentId });
    }

    addPreviousBusinessDay({ parentId }: { parentId: ContextMenuId | string }) {
        return this.addMenuItem(addUUID(CONTEXT_MENU_ID.PREVIOUS_BUSINESS_DAY), '前営業日の予定', 'normal', {
            parentId,
        });
    }

    addSpecifiedDay({ parentId }: { parentId: ContextMenuId | string }) {
        return this.addMenuItem(addUUID(CONTEXT_MENU_ID.SPECIFIED_DAY), '指定日の予定', 'normal', { parentId });
    }

    addTemplate({ parentId }: { parentId: ContextMenuId | string }) {
        return this.addMenuItem(addUUID(CONTEXT_MENU_ID.TEMPLATE), 'テンプレート', 'normal', { parentId });
    }

    addMyself() {
        return this.addMenuItem(CONTEXT_MENU_ID.MYSELF, '自分', 'normal', {});
    }

    addUpdateMyGroup() {
        return this.addMenuItem(CONTEXT_MENU_ID.MY_GROUP, 'Myグループの更新', 'normal', {});
    }

    addSettings() {
        return this.addMenuItem(CONTEXT_MENU_ID.SETTINGS, '設定', 'normal', {});
    }

    addHtml({ checked = false }) {
        return this.addMenuItem(CONTEXT_MENU_ID.HTML, 'HTML', 'radio', { checked });
    }

    addMarkdown({ checked = false }) {
        return this.addMenuItem(CONTEXT_MENU_ID.MARKDOWN, 'Markdown', 'radio', { checked });
    }

    addPlaneText({ checked = false }) {
        return this.addMenuItem(CONTEXT_MENU_ID.PLANE_TEXT, 'Plane Text', 'radio', { checked });
    }

    build() {
        return this.items;
    }
}
