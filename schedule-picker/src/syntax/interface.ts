import type { UserEvent } from "~schedule/events";
import type { DateTime } from "~utils/datetime";

export interface SyntaxGenerator {
  createTitle(dateTime: DateTime): string;
  createEvents(hostname: string, events: UserEvent[]): string;
  getNewLine(): string;
}
