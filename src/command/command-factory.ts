import { Menus, Tabs } from 'webextension-polyfill';
import { CONTEXT_MENU_ID } from '../context-menu/context-menu-builder';
import { Factory } from '../util/factory';
import { Command } from './abstract-command';
import { HtmlCommand } from './html-command';
import { NextBusinessDayCommand } from './insert-schedule/next-business-day-command';
import { PreviousBusinessDayCommand } from './insert-schedule/previous-business-day-command';
import { SpecifiedDayCommand } from './insert-schedule/specified-day-command';
import { TemplateCommand } from './insert-schedule/template-command';
import { TodayCommand } from './insert-schedule/today-command';
import { TomorrowCommand } from './insert-schedule/tomorrow-command';
import { YesterdayCommand } from './insert-schedule/yesterday-command';
import { MarkdownCommand } from './markdown-command';
import { SettingsCommand } from './settings-command';
import { UpdateMyGroupCommand } from './update-my-group-command';

type CreateArgs = {
    id: string | number;
    info: Menus.OnClickData;
    tab: Tabs.Tab;
};

export class CommandFactory implements Factory<CreateArgs, Command> {
    create({ id, info, tab }: CreateArgs): Command {
        switch (id) {
            case CONTEXT_MENU_ID.TODAY:
                return new TodayCommand(info, tab);
            case CONTEXT_MENU_ID.TOMORROW:
                return new TomorrowCommand(info, tab);
            case CONTEXT_MENU_ID.YESTERDAY:
                return new YesterdayCommand(info, tab);
            case CONTEXT_MENU_ID.NEXT_BUSINESS_DAY:
                return new NextBusinessDayCommand(info, tab);
            case CONTEXT_MENU_ID.PREVIOUS_BUSINESS_DAY:
                return new PreviousBusinessDayCommand(info, tab);
            case CONTEXT_MENU_ID.SPECIFIED_DAY:
                return new SpecifiedDayCommand(info, tab);
            case CONTEXT_MENU_ID.TEMPLATE:
                return new TemplateCommand(info, tab);
            case CONTEXT_MENU_ID.HTML:
                return new HtmlCommand();
            case CONTEXT_MENU_ID.MARKDOWN:
                return new MarkdownCommand();
            case CONTEXT_MENU_ID.MY_GROUP:
                return new UpdateMyGroupCommand(tab);
            case CONTEXT_MENU_ID.SETTINGS:
                return new SettingsCommand();
            default:
                throw new Error('Command is not implemented.');
        }
    }
}
