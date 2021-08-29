import { ContextMenuItem } from './context-menus';

export const CONTEXT_MENU_ID = {
    ROOT: 'root',
    TODAY: 'today',
    TOMORROW: 'tomorrow',
    YESTERDAY: 'yesterday',
    NEXT_BUSINESS_DAY: 'nextBusinessDay',
    PREVIOUS_BUSINESS_DAY: 'previousBusinessDay',
    SPECIFIED_DAY: 'specifiedDay',
    TEMPLATE: 'template',
    MYSELF: 'myself',
    SETTINGS: 'settings',
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

    addMenuItem(id: ContextMenuId, title: string, parentId: ContextMenuId = CONTEXT_MENU_ID.ROOT) {
        this.items.push({
            id: id as string,
            title,
            parentId: parentId as string,
            type: 'normal',
            contexts: ['editable'],
        });
        return this;
    }

    addToday(parentId?: ContextMenuId) {
        return this.addMenuItem(CONTEXT_MENU_ID.TODAY, '今日の予定', parentId);
    }

    addTomorrow(parentId?: ContextMenuId) {
        return this.addMenuItem(CONTEXT_MENU_ID.TOMORROW, '明日の予定', parentId);
    }

    addYesterDay(parentId?: ContextMenuId) {
        return this.addMenuItem(CONTEXT_MENU_ID.YESTERDAY, '昨日の予定', parentId);
    }

    addNextBusinessDay(parentId?: ContextMenuId) {
        return this.addMenuItem(CONTEXT_MENU_ID.NEXT_BUSINESS_DAY, '翌営業日の予定', parentId);
    }

    addPreviousBusinessDay(parentId?: ContextMenuId) {
        return this.addMenuItem(CONTEXT_MENU_ID.PREVIOUS_BUSINESS_DAY, '前営業日の予定', parentId);
    }

    addSpecifiedDay(parentId?: ContextMenuId) {
        return this.addMenuItem(CONTEXT_MENU_ID.SPECIFIED_DAY, '指定日の予定', parentId);
    }

    addTemplate(parentId?: ContextMenuId) {
        return this.addMenuItem(CONTEXT_MENU_ID.TEMPLATE, 'テンプレート', parentId);
    }

    addSettings(parentId?: ContextMenuId) {
        return this.addMenuItem(CONTEXT_MENU_ID.SETTINGS, '設定', parentId);
    }

    build() {
        return this.items;
    }
}
