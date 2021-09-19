import { Menus, Tabs } from 'webextension-polyfill';

export abstract class Command {
    abstract execute(info: Menus.OnClickData, tab: Tabs.Tab): void;
}
