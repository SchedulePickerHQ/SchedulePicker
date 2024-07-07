import type { Command } from "./interface";

export class TomorrowCommand implements Command {
  execute(): void {
    console.log("TomorrowCommand");
  }
}
