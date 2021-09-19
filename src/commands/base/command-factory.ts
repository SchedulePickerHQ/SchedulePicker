import { CONTEXT_MENU_ID } from '../../contextMenus/context-menu-builder';
import { Factory } from '../../utils/factory';
import { HtmlCommand } from '../html-command';
import { MarkdownCommand } from '../markdown-command';
import { NextBusinessDayCommand } from '../next-business-day-command';
import { SettingsCommand } from '../settings-command';
import { SpecifiedDayCommand } from '../specified-day-command';
import { TodayCommand } from '../today-command';
import { Command } from './command';

export class CommandFactory implements Factory<string | number, Command> {
    create(id: string | number): Command {
        switch (id) {
            case CONTEXT_MENU_ID.TODAY:
                return new TodayCommand();
            case CONTEXT_MENU_ID.NEXT_BUSINESS_DAY:
                return new NextBusinessDayCommand();
            case CONTEXT_MENU_ID.SPECIFIED_DAY:
                return new SpecifiedDayCommand();
            case CONTEXT_MENU_ID.HTML:
                return new HtmlCommand();
            case CONTEXT_MENU_ID.MARKDOWN:
                return new MarkdownCommand();
            case CONTEXT_MENU_ID.SETTINGS:
                return new SettingsCommand();
            default:
                throw new Error('Action is not implemented.');
        }
    }
}
