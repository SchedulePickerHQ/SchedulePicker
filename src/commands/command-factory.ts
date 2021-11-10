import { CONTEXT_MENU_ID } from '../contextMenus/context-menu-builder';
import { Factory } from '../utils/factory';
import { Command } from './base/command';
import { SettingsCommand } from './exceptional/settings-command';
import { UpdateMyGroupCommand } from './exceptional/update-my-group-command';
import { NextBusinessDayCommand } from './insertText/next-business-day-command';
import { PreviousBusinessDayCommand } from './insertText/previous-business-day-command';
import { SpecifiedDayCommand } from './insertText/specified-day-command';
import { TemplateCommand } from './insertText/template-command';
import { TodayCommand } from './insertText/today-command';
import { TomorrowCommand } from './insertText/tomorrow-command';
import { YesterdayCommand } from './insertText/yesterday-command';
import { HtmlCommand } from './selectSyntax/html-command';
import { MarkdownCommand } from './selectSyntax/markdown-command';

export class CommandFactory implements Factory<string | number, Command> {
    create(id: string): Command {
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
            case CONTEXT_MENU_ID.TEMPLATE:
                return new TemplateCommand();
            case CONTEXT_MENU_ID.HTML:
                return new HtmlCommand();
            case CONTEXT_MENU_ID.MARKDOWN:
                return new MarkdownCommand();
            case CONTEXT_MENU_ID.MY_GROUP:
                return new UpdateMyGroupCommand();
            case CONTEXT_MENU_ID.SETTINGS:
                return new SettingsCommand();
            default:
                throw new Error('Command is not implemented.');
        }
    }
}
