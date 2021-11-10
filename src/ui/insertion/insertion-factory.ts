import { SupportBrowser } from '../../utils/support-browser';
import { Factory } from '../../utils/factory';
import { Insertion } from './base/abstract-insertion';
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
