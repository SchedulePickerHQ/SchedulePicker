import { setSyntax } from '../storage';
import { AbstractCommand } from './abstract-command';

export class HtmlCommand extends AbstractCommand {
    async execute() {
        await setSyntax('html');
    }
}
