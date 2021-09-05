import { Menus, Tabs } from 'webextension-polyfill';
import { AbstractAction } from './abstract-action';

export class SettingsAction extends AbstractAction {
    execute(info: Menus.OnClickData, tab: Tabs.Tab) {
        this.sendMessage();
    }
}
