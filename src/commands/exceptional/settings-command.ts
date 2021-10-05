import browser, { Menus, Tabs } from 'webextension-polyfill';
import { AbstractCommand } from '../base/command';

export class SettingsCommand extends AbstractCommand {
    async execute(_info: Menus.OnClickData, _tab: Tabs.Tab) {
        await browser.runtime.openOptionsPage();
    }
}
