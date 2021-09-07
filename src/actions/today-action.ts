import { Menus, Tabs } from 'webextension-polyfill';
import { getScheduleEvents } from '../garoon/schedule';
import { SyntaxFactory } from '../syntax/syntax-factory';
import { createEndOfTime, createStartOfTime, getNowDateTime } from '../utils/date-time';
import { AbstractAction } from './abstract-action';

export class TodayAction extends AbstractAction {
    async execute(info: Menus.OnClickData, tab: Tabs.Tab) {
        if (tab.url === undefined) {
            return;
        }

        const domain = new URL(tab.url).hostname;
        const dateTime = getNowDateTime();

        try {
            const events = await getScheduleEvents(domain, {
                startTime: createStartOfTime(dateTime),
                endTime: createEndOfTime(dateTime),
            });
            const syntax = new SyntaxFactory().create('html');
            console.log(events);
        } catch (error: unknown) {
            // TODO: 予定がないとき or 予定の取得に失敗したときのことを考える。
            console.dir(error);
        } finally {
            // TODO: Loading を止める
        }
    }
}
