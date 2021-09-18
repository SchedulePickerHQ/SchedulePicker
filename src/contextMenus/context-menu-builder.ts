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
    MYSELF: 'myself',
    SETTINGS: 'settings',
    HTML: 'html',
    MARKDOWN: 'markdown',
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
        id: ContextMenuId,
        title: string,
        type: ItemType,
        options: {
            checked?: boolean;
            parentId?: ContextMenuId;
        },
    ) {
        const { checked, parentId } = options;
        this.items.push({
            id: id as string,
            title,
            type,
            checked,
            parentId: parentId ? (parentId as string) : CONTEXT_MENU_ID.ROOT,
            contexts: ['editable'],
        });
        return this;
    }

    addToday() {
        return this.addMenuItem(CONTEXT_MENU_ID.TODAY, '今日の予定', 'normal', {});
    }

    addTomorrow() {
        return this.addMenuItem(CONTEXT_MENU_ID.TOMORROW, '明日の予定', 'normal', {});
    }

    addYesterDay() {
        return this.addMenuItem(CONTEXT_MENU_ID.YESTERDAY, '昨日の予定', 'normal', {});
    }

    addNextBusinessDay() {
        return this.addMenuItem(CONTEXT_MENU_ID.NEXT_BUSINESS_DAY, '翌営業日の予定', 'normal', {});
    }

    addPreviousBusinessDay() {
        return this.addMenuItem(CONTEXT_MENU_ID.PREVIOUS_BUSINESS_DAY, '前営業日の予定', 'normal', {});
    }

    addSpecifiedDay() {
        return this.addMenuItem(CONTEXT_MENU_ID.SPECIFIED_DAY, '指定日の予定', 'normal', {});
    }

    addTemplate() {
        return this.addMenuItem(CONTEXT_MENU_ID.TEMPLATE, 'テンプレート', 'normal', {});
    }

    addSettings() {
        return this.addMenuItem(CONTEXT_MENU_ID.SETTINGS, '設定', 'normal', {});
    }

    addHtml(checked = false) {
        return this.addMenuItem(CONTEXT_MENU_ID.HTML, 'HTML', 'radio', { checked });
    }

    addMarkdown(checked = false) {
        return this.addMenuItem(CONTEXT_MENU_ID.MARKDOWN, 'Markdown', 'radio', { checked });
    }

    build() {
        return this.items;
    }
}

export const VisibleForTesting = {
    ContextMenuBuilder,
};
