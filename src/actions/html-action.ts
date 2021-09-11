import { Menus, Tabs } from 'webextension-polyfill';
import { setSyntax } from '../storage/storage';
import { AbstractAction } from './base/abstract-action';

export class HtmlAction extends AbstractAction {
    async execute(_info: Menus.OnClickData, _tab: Tabs.Tab) {
        await setSyntax('html');
    }
}
