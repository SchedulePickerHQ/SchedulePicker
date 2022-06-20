import { setSyntax } from '../storage';
import { AbstractCommand } from './abstract-command';

export class PlaneTextCommand extends AbstractCommand {
    async execute() {
        await setSyntax('planeText');
    }
}
