import { Menus, Tabs } from 'webextension-polyfill';
import { setSyntax } from '../storage/storage';
import { AbstractAction } from './abstract-action';

export class MarkdownAction extends AbstractAction {
    async execute(_info: Menus.OnClickData, _tab: Tabs.Tab) {
        await setSyntax('markdown');
    }
}
