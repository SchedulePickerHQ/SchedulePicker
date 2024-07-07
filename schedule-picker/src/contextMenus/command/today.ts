import type { Command } from "./interface";

export class TodayCommand implements Command {
  execute(): void {
    console.log("TodayCommand");
  }
}
