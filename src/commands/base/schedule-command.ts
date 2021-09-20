import { Menus, Tabs } from 'webextension-polyfill';
import { assertExists } from '../../utils/asserts';
import { LOADING_STATUS } from '../../utils/loading';
import { sendLoadingStatus, sendSchedule } from '../sender';
import { Command } from './command';

export abstract class ScheduleCommand extends Command {
    async execute(info: Menus.OnClickData, tab: Tabs.Tab) {
        assertExists(tab.id);
        assertExists(tab.url);
        const domain = new URL(tab.url).hostname;
        await sendLoadingStatus(tab.id, LOADING_STATUS.SHOW);

        try {
            const schedule = await this.createSchedule(domain);

            if (schedule === null) {
                return;
            }

            await sendSchedule(tab.id, schedule);
        } catch (error: unknown) {
            // TODO: エラーをクライアント側に通知するかも？
            throw error;
        } finally {
            await sendLoadingStatus(tab.id, LOADING_STATUS.HIDE);
        }
    }

    protected abstract createSchedule(domain: string): Promise<string | null>;
}
