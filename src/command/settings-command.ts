import { openSettingsPage } from '../send-message/to-background';
import { AbstractCommand } from './abstract-command';

export class SettingsCommand extends AbstractCommand {
    async execute() {
        await openSettingsPage();
    }
}
