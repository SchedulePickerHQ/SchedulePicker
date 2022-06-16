import { setSyntax } from '../storage';
import { AbstractCommand } from './abstract-command';

export class MarkdownCommand extends AbstractCommand {
    async execute() {
        await setSyntax('markdown');
    }
}
