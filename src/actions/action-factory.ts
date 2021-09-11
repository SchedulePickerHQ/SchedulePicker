import { CONTEXT_MENU_ID } from '../contextMenus/context-menu-builder';
import { Factory } from '../utils/factory';
import { Action } from './abstract-action';
import { NextBusinessDayAction } from './next-business-day-action';
import { SettingsAction } from './settings-action';
import { TodayAction } from './today-action';

export class ActionFactory implements Factory<string | number, Action> {
    create(id: string | number): Action {
        switch (id) {
            case CONTEXT_MENU_ID.TODAY:
                return new TodayAction();
            case CONTEXT_MENU_ID.NEXT_BUSINESS_DAY:
                return new NextBusinessDayAction();
            case CONTEXT_MENU_ID.SETTINGS:
                return new SettingsAction();
            default:
                throw new Error('Action is not implemented.');
        }
    }
}
