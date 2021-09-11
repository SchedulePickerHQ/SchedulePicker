import browser, { Menus, Tabs } from 'webextension-polyfill';
import { AbstractAction } from './base/abstract-action';

export class SettingsAction extends AbstractAction {
    async execute(_info: Menus.OnClickData, _tab: Tabs.Tab) {
        await browser.runtime.openOptionsPage();
    }
}
