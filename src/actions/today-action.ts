import { Menus, Tabs } from 'webextension-polyfill';
import { getScheduleEvents } from '../garoon/schedule';
import { getSyntax } from '../storage/storage';
import { SyntaxFactory } from '../syntax/base/syntax-factory';
import { assertExists } from '../utils/asserts';
import { createEndOfTime, createStartOfTime, getNowDateTime } from '../utils/date-time';
import { LOADING_STATUS } from '../utils/loading';
import { AbstractAction } from './base/abstract-action';

export class TodayAction extends AbstractAction {
    async execute(info: Menus.OnClickData, tab: Tabs.Tab) {
        assertExists(tab.id);
        assertExists(tab.url);
        const domain = new URL(tab.url).hostname;
        const dateTime = getNowDateTime();
        const syntax = await getSyntax();
        await this.postLoadingStatus(tab.id, LOADING_STATUS.SHOW);

        try {
            const events = await getScheduleEvents(domain, {
                startTime: createStartOfTime(dateTime),
                endTime: createEndOfTime(dateTime),
            });
            const factory = new SyntaxFactory().create(syntax);
            const message = factory.createTitle(dateTime) + factory.createEvents(events);
            await this.postScheduleEvents(tab.id, message);
        } catch (error: unknown) {
            // TODO: 予定がないとき or 予定の取得に失敗したときのことを考える。
            console.dir(error);
        } finally {
            await this.postLoadingStatus(tab.id, LOADING_STATUS.HIDE);
        }
    }
}
