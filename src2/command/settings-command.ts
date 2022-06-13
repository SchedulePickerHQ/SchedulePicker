import browser from 'webextension-polyfill';
import { AbstractCommand } from './abstract-command';

export class SettingsCommand extends AbstractCommand {
    async execute() {
        await browser.runtime.openOptionsPage();
    }
}
