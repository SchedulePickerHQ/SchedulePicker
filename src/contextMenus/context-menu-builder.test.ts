import { ContextMenuBuilder, CONTEXT_MENU_ID } from './context-menu-builder';

const createItem = (id: string, title: string, parentId?: string) => ({
    id,
    title,
    parentId,
    type: 'normal',
    contexts: ['editable'],
});

describe('ContextMenuBuilder', () => {
    test('build()', () => {
        const expectItems = [
            createItem(CONTEXT_MENU_ID.ROOT, 'SchedulePicker'),
            createItem(CONTEXT_MENU_ID.TODAY, '今日の予定', CONTEXT_MENU_ID.ROOT),
            createItem(CONTEXT_MENU_ID.TOMORROW, '明日の予定', CONTEXT_MENU_ID.ROOT),
            createItem(CONTEXT_MENU_ID.YESTERDAY, '昨日の予定', CONTEXT_MENU_ID.ROOT),
            createItem(CONTEXT_MENU_ID.NEXT_BUSINESS_DAY, '翌営業日の予定', CONTEXT_MENU_ID.ROOT),
            createItem(CONTEXT_MENU_ID.PREVIOUS_BUSINESS_DAY, '前営業日の予定', CONTEXT_MENU_ID.ROOT),
            createItem(CONTEXT_MENU_ID.SPECIFIED_DAY, '指定日の予定', CONTEXT_MENU_ID.ROOT),
            createItem(CONTEXT_MENU_ID.TEMPLATE, 'テンプレート', CONTEXT_MENU_ID.ROOT),
            createItem(CONTEXT_MENU_ID.SETTINGS, '設定', CONTEXT_MENU_ID.ROOT),
            createItem(CONTEXT_MENU_ID.MYSELF, '自分の予定', CONTEXT_MENU_ID.TODAY),
        ];
        const items = new ContextMenuBuilder()
            .addToday()
            .addTomorrow()
            .addYesterDay()
            .addNextBusinessDay()
            .addPreviousBusinessDay()
            .addSpecifiedDay()
            .addTemplate()
            .addSettings()
            .addMenuItem(CONTEXT_MENU_ID.MYSELF, '自分の予定', CONTEXT_MENU_ID.TODAY)
            .build();
        expect(items).toEqual(expectItems);
    });
});
