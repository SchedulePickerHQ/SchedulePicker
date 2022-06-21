import { Menus, Tabs } from 'webextension-polyfill';
import { CONTEXT_MENU_ID } from '../../context-menu/context-menu-builder';
import { InsertionFactory } from '../../insertion/insertion-factory';
import { getToUseMyGroup } from '../../storage';
import { assert, assertExists } from '../../util/assert';
import { isSupportBrowser } from '../../util/support-browser';
import { isString } from '../../util/type-check';
import { hideLoading, showLoading } from '../../view/loading';
import { AbstractCommand } from '../abstract-command';

export abstract class AbstractInsertScheduleCommand extends AbstractCommand {
    protected info: Menus.OnClickData;
    protected tab: Tabs.Tab;

    constructor(info: Menus.OnClickData, tab: Tabs.Tab) {
        super();
        this.info = info;
        this.tab = tab;
    }

    async execute() {
        assert(isString(this.info.parentMenuItemId));
        assertExists(this.tab.url);
        showLoading();
        const domain = new URL(this.tab.url).hostname;
        const useMyGroup = await getToUseMyGroup();
        const groupId =
            useMyGroup &&
            this.info.parentMenuItemId !== CONTEXT_MENU_ID.MYSELF &&
            this.info.parentMenuItemId !== CONTEXT_MENU_ID.ROOT
                ? this.info.parentMenuItemId
                : null;
        try {
            const schedule = await this.getSchedule(domain, groupId);

            if (schedule !== null && document.activeElement) {
                const browserEnv = process.env.BROWSER_ENV;

                if (isSupportBrowser(browserEnv)) {
                    const insertion = new InsertionFactory().create(browserEnv);
                    insertion.insertTextAtCaret(window, document.activeElement as HTMLElement, schedule);
                } else {
                    alert('error_not_support_browser');
                }
            }
        } catch {
            alert('error_get_events');
        } finally {
            hideLoading();
        }
    }

    protected abstract getSchedule(domain: string, groupId: string | null): Promise<string | null>;
}
