import { Menus, Tabs } from 'webextension-polyfill';

export interface Command {
    execute(info: Menus.OnClickData, tab: Tabs.Tab): void;
}

export abstract class AbstractCommand implements Command {
    abstract execute(info: Menus.OnClickData, tab: Tabs.Tab): void;
}
