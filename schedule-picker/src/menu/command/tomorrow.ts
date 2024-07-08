import type { Command } from "../../utils/interface";

export class TomorrowCommand implements Command {
  execute(): void {
    console.log("TomorrowCommand");
  }
}
