import { ContextMenuBuilder, ContextMenuId, ItemType, CONTEXT_MENU_ID } from '../context-menu-builder';
import * as uuidModule from '../../utils/uuid';

const createItem = (
    id: string,
    title: string,
    type: ItemType,
    options: { checked?: boolean; parentId?: ContextMenuId },
) => {
    const { checked, parentId } = options;
    return {
        id,
        title,
        type,
        checked,
        parentId: parentId ? parentId : CONTEXT_MENU_ID.ROOT,
        contexts: ['editable'],
    };
};

const MY_GROUP_ID = '1';

describe('ContextMenuBuilder', () => {
    test('Build context menu', () => {
        jest.spyOn(uuidModule, 'addUUID').mockImplementation((id) => id);

        const expectItems = [
            {
                id: CONTEXT_MENU_ID.ROOT,
                title: 'SchedulePicker beta',
                type: 'normal',
                contexts: ['editable'],
            },
            createItem(CONTEXT_MENU_ID.TODAY, '今日の予定', 'normal', {}),
            createItem(CONTEXT_MENU_ID.TOMORROW, '明日の予定', 'normal', {}),
            createItem(CONTEXT_MENU_ID.YESTERDAY, '昨日の予定', 'normal', {}),
            createItem(CONTEXT_MENU_ID.NEXT_BUSINESS_DAY, '翌営業日の予定', 'normal', {}),
            createItem(CONTEXT_MENU_ID.PREVIOUS_BUSINESS_DAY, '前営業日の予定', 'normal', {}),
            createItem(CONTEXT_MENU_ID.SPECIFIED_DAY, '指定日の予定', 'normal', {}),
            createItem(CONTEXT_MENU_ID.TEMPLATE, 'テンプレート', 'normal', {}),
            createItem(CONTEXT_MENU_ID.MY_GROUP, 'Myグループの更新', 'normal', {}),
            createItem(CONTEXT_MENU_ID.SETTINGS, '設定', 'normal', {}),
            createItem(CONTEXT_MENU_ID.HTML, 'HTML', 'radio', { checked: true }),
            createItem(CONTEXT_MENU_ID.MARKDOWN, 'Markdown', 'radio', { checked: false }),
            createItem(CONTEXT_MENU_ID.MYSELF, '自分', 'normal', {}),
            createItem(MY_GROUP_ID, 'Myグループ', 'normal', {}),
        ];
        const items = new ContextMenuBuilder()
            .addToday({ parentId: CONTEXT_MENU_ID.ROOT })
            .addTomorrow({ parentId: CONTEXT_MENU_ID.ROOT })
            .addYesterDay({ parentId: CONTEXT_MENU_ID.ROOT })
            .addNextBusinessDay({ parentId: CONTEXT_MENU_ID.ROOT })
            .addPreviousBusinessDay({ parentId: CONTEXT_MENU_ID.ROOT })
            .addSpecifiedDay({ parentId: CONTEXT_MENU_ID.ROOT })
            .addTemplate({ parentId: CONTEXT_MENU_ID.ROOT })
            .addUpdateMyGroup()
            .addSettings()
            .addHtml({ checked: true })
            .addMarkdown({ checked: false })
            .addMyself()
            .addMenuItem(MY_GROUP_ID, 'Myグループ', 'normal', { parentId: CONTEXT_MENU_ID.ROOT })
            .build();
        expect(items).toEqual(expectItems);
    });
});
