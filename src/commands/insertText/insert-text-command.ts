import { Menus, Tabs } from 'webextension-polyfill';
import { assertExists } from '../../utils/asserts';
import { LOADING_STATUS } from '../../utils/loading';
import { sendLoadingStatus, sendSchedule, sendErrorMessage } from '../sender';
import { Command } from '../base/command';

export abstract class InsertTextCommand extends Command {
    async execute(info: Menus.OnClickData, tab: Tabs.Tab) {
        assertExists(tab.id);
        assertExists(tab.url);
        const domain = new URL(tab.url).hostname;
        await sendLoadingStatus(tab.id, LOADING_STATUS.SHOW);

        try {
            const schedule = await this.createInsertText(domain);

            if (schedule === null) {
                await sendLoadingStatus(tab.id, LOADING_STATUS.HIDE);
                return;
            }

            await sendSchedule(tab.id, schedule);
        } catch (error: unknown) {
            await sendErrorMessage(tab.id, '通信に失敗しました');
            throw error;
        } finally {
            await sendLoadingStatus(tab.id, LOADING_STATUS.HIDE);
        }
    }

    protected abstract createInsertText(domain: string): Promise<string | null>;
}
