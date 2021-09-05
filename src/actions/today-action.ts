import { Menus, Tabs } from 'webextension-polyfill';
import { AbstractAction } from './abstract-action';

export class TodayAction extends AbstractAction {
    execute(info: Menus.OnClickData, tab: Tabs.Tab) {
        this.sendMessage();
    }
}
