import { Menus, Tabs } from 'webextension-polyfill';
import { setSyntax } from '../../storage/storage';
import { AbstractCommand } from '../base/command';

export class MarkdownCommand extends AbstractCommand {
    async execute(_info: Menus.OnClickData, _tab: Tabs.Tab) {
        await setSyntax('markdown');
    }
}
