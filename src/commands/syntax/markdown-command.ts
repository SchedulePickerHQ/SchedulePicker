import { Menus, Tabs } from 'webextension-polyfill';
import { setSyntax } from '../../storage/storage';
import { Command } from '../base/command';

export class MarkdownCommand extends Command {
    async execute(_info: Menus.OnClickData, _tab: Tabs.Tab) {
        await setSyntax('markdown');
    }
}
