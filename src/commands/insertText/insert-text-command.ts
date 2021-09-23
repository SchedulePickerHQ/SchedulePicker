import { Menus, Tabs } from 'webextension-polyfill';
import { assertExists } from '../../utils/asserts';
import { LOADING_STATUS } from '../../utils/loading';
import { sendLoadingStatus, sendInsertText, sendErrorMessage } from '../sender';
import { Command } from '../base/command';

export abstract class InsertTextCommand extends Command {
    async execute(_info: Menus.OnClickData, tab: Tabs.Tab) {
        assertExists(tab.id);
        assertExists(tab.url);
        const domain = new URL(tab.url).hostname;
        await sendLoadingStatus(tab.id, LOADING_STATUS.SHOW);

        try {
            const text = await this.createInsertText(domain);

            if (text === null) {
                await sendLoadingStatus(tab.id, LOADING_STATUS.HIDE);
                return;
            }

            await sendInsertText(tab.id, text);
        } catch (error: unknown) {
            await sendErrorMessage(tab.id, '予定の取得に失敗しました');
            throw error;
        } finally {
            await sendLoadingStatus(tab.id, LOADING_STATUS.HIDE);
        }
    }

    protected abstract createInsertText(domain: string): Promise<string | null>;
}
