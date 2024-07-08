import type { Command } from "../utils/interface";

export class ContextMenuController {
  private commands = new Map<string, Command>();

  setCommend(id: string, command: Command) {
    this.commands.set(id, command);
  }

  action(id: string) {
    this.commands.get(id)?.execute();
  }
}
