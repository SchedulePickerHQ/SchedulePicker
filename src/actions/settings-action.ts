import { Menus, Tabs } from 'webextension-polyfill';
import { AbstractAction } from './base/abstract-action';

export class SettingsAction extends AbstractAction {
    execute(_info: Menus.OnClickData, _tab: Tabs.Tab) {
        // TODO: オプション画面を別タブで開く
    }
}
