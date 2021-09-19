import { Factory } from '../../utils/factory';
import { HtmlAction } from '../html-action';
import { MarkdownAction } from '../markdown-action';
import { NextBusinessDayAction } from '../next-business-day-action';
import { SettingsAction } from '../settings-action';
import { TodayAction } from '../today-action';
import { CONTEXT_MENU_ID } from '../../contextMenus/context-menu-builder';
import { SpecifiedDayAction } from '../specified-day-action';
import { Action } from './abstract-action';

export class ActionFactory implements Factory<string | number, Action> {
    create(id: string | number): Action {
        switch (id) {
            case CONTEXT_MENU_ID.TODAY:
                return new TodayAction();
            case CONTEXT_MENU_ID.NEXT_BUSINESS_DAY:
                return new NextBusinessDayAction();
            case CONTEXT_MENU_ID.SPECIFIED_DAY:
                return new SpecifiedDayAction();
            case CONTEXT_MENU_ID.HTML:
                return new HtmlAction();
            case CONTEXT_MENU_ID.MARKDOWN:
                return new MarkdownAction();
            case CONTEXT_MENU_ID.SETTINGS:
                return new SettingsAction();
            default:
                throw new Error('Action is not implemented.');
        }
    }
}
