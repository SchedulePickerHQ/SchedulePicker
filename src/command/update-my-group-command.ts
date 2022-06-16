import { Tabs } from 'webextension-polyfill';
import { getMyGroups } from '../events/general';
import { buildContextMenu } from '../send-message/to-background';
import { setMyGroups } from '../storage';
import { assertExists } from '../util/assert';
import { showAlert } from '../view/alert';
import { hideLoading, showLoading } from '../view/loading';
import { AbstractCommand } from './abstract-command';

export class UpdateMyGroupCommand extends AbstractCommand {
    protected tab: Tabs.Tab;

    constructor(tab: Tabs.Tab) {
        super();
        this.tab = tab;
    }

    async execute() {
        assertExists(this.tab.id);
        assertExists(this.tab.url);
        const domain = new URL(this.tab.url).hostname;
        showLoading();

        try {
            const myGroups = await getMyGroups(domain);
            await setMyGroups(myGroups);
            await buildContextMenu();
        } catch {
            showAlert('Myグループの更新に失敗しました');
        } finally {
            hideLoading();
        }
    }
}
