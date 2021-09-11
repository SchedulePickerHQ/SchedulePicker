import { Menus, Tabs } from 'webextension-polyfill';
import { searchNextBusinessDateTime } from '../garoon/general';
import { getScheduleEvents } from '../garoon/schedule';
import { SyntaxFactory } from '../syntax/syntax-factory';
import { createEndOfTime, createStartOfTime } from '../utils/date-time';
import { LOADING_STATUS } from '../utils/loading';
import { assertExists } from '../utils/asserts';
import { AbstractAction } from './abstract-action';

export class NextBusinessDayAction extends AbstractAction {
    async execute(info: Menus.OnClickData, tab: Tabs.Tab) {
        assertExists(tab.id);
        assertExists(tab.url);
        const domain = new URL(tab.url).hostname;
        await this.postLoadingStatus(tab.id, LOADING_STATUS.SHOW);

        try {
            const dateTime = await searchNextBusinessDateTime(domain);
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
