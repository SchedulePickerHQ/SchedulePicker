import { Menus, Tabs } from 'webextension-polyfill';
import { getScheduleEvents } from '../garoon/schedule';
import { SyntaxFactory } from '../syntax/syntax-factory';
import { createEndOfTime, createStartOfTime, getNowDateTime } from '../utils/date-time';
import { LOADING_STATUS } from '../utils/loading';
import { AbstractAction } from './abstract-action';

export class TodayAction extends AbstractAction {
    async execute(info: Menus.OnClickData, tab: Tabs.Tab) {
        if (tab.id === undefined || tab.url === undefined) {
            return;
        }

        const domain = new URL(tab.url).hostname;
        const dateTime = getNowDateTime();

        await this.postLoadingStatus(tab.id, LOADING_STATUS.SHOW);
        try {
            const events = await getScheduleEvents(domain, {
                startTime: createStartOfTime(dateTime),
                endTime: createEndOfTime(dateTime),
            });
            const syntax = new SyntaxFactory().create('markdown');
            const message = syntax.createTitle(dateTime) + syntax.createEvents(events);
            await this.postScheduleEvents(tab.id, message);
        } catch (error: unknown) {
            // TODO: 予定がないとき or 予定の取得に失敗したときのことを考える。
            console.dir(error);
        } finally {
            await this.postLoadingStatus(tab.id, LOADING_STATUS.HIDE);
        }
    }
}
