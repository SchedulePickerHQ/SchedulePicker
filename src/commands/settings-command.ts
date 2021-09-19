import browser, { Menus, Tabs } from 'webextension-polyfill';
import { Command } from './base/command';

export class SettingsCommand extends Command {
    async execute(_info: Menus.OnClickData, _tab: Tabs.Tab) {
        await browser.runtime.openOptionsPage();
    }
}
