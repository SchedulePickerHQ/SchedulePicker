import { Menus, Tabs } from 'webextension-polyfill';
import { getToUseMyGroup } from '../../storage/storage';
import { LOADING_STATUS } from '../../utils/loading';
import { isString } from '../../utils/type-check';
import { Command } from '../base/command';
import { sendErrorMessage, sendInsertText, sendLoadingStatus } from '../sender';
import { CONTEXT_MENU_ID } from '../../contextMenus/context-menu-builder';
import { assert, assertExists } from '../../utils/asserts';

export abstract class InsertTextCommand extends Command {
    async execute(info: Menus.OnClickData, tab: Tabs.Tab) {
        assert(isString(info.parentMenuItemId));
        assertExists(tab.id);
        assertExists(tab.url);
        const domain = new URL(tab.url).hostname;
        await sendLoadingStatus(tab.id, LOADING_STATUS.SHOW);
        const useMyGroup = await getToUseMyGroup();
        const groupId =
            useMyGroup &&
            info.parentMenuItemId !== CONTEXT_MENU_ID.MYSELF &&
            info.parentMenuItemId !== CONTEXT_MENU_ID.ROOT
                ? info.parentMenuItemId
                : null;

        try {
            const schedule = await this.createSchedule(domain, groupId);

            if (schedule === null) {
                await sendLoadingStatus(tab.id, LOADING_STATUS.HIDE);
                return;
            }

            await sendInsertText(tab.id, schedule);
        } catch (error: unknown) {
            await sendErrorMessage(tab.id, '予定の取得に失敗しました');
            throw error;
        } finally {
            await sendLoadingStatus(tab.id, LOADING_STATUS.HIDE);
        }
    }

    protected abstract createSchedule(domain: string, groupId: string | null): Promise<string | null>;
}
