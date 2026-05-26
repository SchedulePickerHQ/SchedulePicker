import type { Command } from "../types";

export class ContextMenuController {
	private commands = new Map<string, Command>();

	setCommand(id: string, command: Command) {
		this.commands.set(id, command);
	}

	clicked(id: string) {
		this.commands.get(id)?.execute();
	}
}
