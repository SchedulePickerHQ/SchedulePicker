import { CONTEXT_MENU_ID } from '../contextMenus/context-menu-builder';
import { Factory } from '../utils/factory';
import { Command } from './base/command';
import { SettingsCommand } from './exceptional/settings-command';
import { NextBusinessDayCommand } from './schedule/next-business-day-command';
import { PreviousBusinessDayCommand } from './schedule/previous-business-day-command';
import { SpecifiedDayCommand } from './schedule/specified-day-command';
import { TodayCommand } from './schedule/today-command';
import { TomorrowCommand } from './schedule/tomorrow-command';
import { YesterdayCommand } from './schedule/yesterday-command';
import { HtmlCommand } from './syntax/html-command';
import { MarkdownCommand } from './syntax/markdown-command';

export class CommandFactory implements Factory<string | number, Command> {
    create(id: string | number): Command {
        switch (id) {
            case CONTEXT_MENU_ID.TODAY:
                return new TodayCommand();
            case CONTEXT_MENU_ID.TOMORROW:
                return new TomorrowCommand();
            case CONTEXT_MENU_ID.YESTERDAY:
                return new YesterdayCommand();
            case CONTEXT_MENU_ID.NEXT_BUSINESS_DAY:
                return new NextBusinessDayCommand();
            case CONTEXT_MENU_ID.PREVIOUS_BUSINESS_DAY:
                return new PreviousBusinessDayCommand();
            case CONTEXT_MENU_ID.SPECIFIED_DAY:
                return new SpecifiedDayCommand();
            case CONTEXT_MENU_ID.HTML:
                return new HtmlCommand();
            case CONTEXT_MENU_ID.MARKDOWN:
                return new MarkdownCommand();
            case CONTEXT_MENU_ID.SETTINGS:
                return new SettingsCommand();
            default:
                throw new Error('Command is not implemented.');
        }
    }
}
