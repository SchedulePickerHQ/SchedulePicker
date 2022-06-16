import { Factory } from '../util/factory';
import { SupportBrowser } from '../util/support-browser';
import { Insertion } from './abstract-insertion';
import { ChromeInsertion } from './chrome-insertion';
import { FirefoxInsertion } from './firefox-insertion';

export class InsertionFactory implements Factory<SupportBrowser, Insertion> {
    create(browser: SupportBrowser): Insertion {
        switch (browser) {
            case 'chrome':
                return new ChromeInsertion();
            case 'firefox':
                return new FirefoxInsertion();
            default:
                throw new Error('Insertion is not implemented.');
        }
    }
}
