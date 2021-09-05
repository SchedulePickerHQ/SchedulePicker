import { Menus, Tabs } from 'webextension-polyfill';

export interface Action {
    execute(info: browser.Menus.OnClickData, tab: browser.Tabs.Tab): void;
}

export abstract class AbstractAction implements Action {
    protected sendMessage() {
        console.log('send message!');
    }

    abstract execute(info: Menus.OnClickData, tab: Tabs.Tab): void;
}
