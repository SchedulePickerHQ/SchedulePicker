import type { DateTime } from "../../utils/datetime";
import type { UserEvent } from "../schedule/events";

export interface SyntaxGenerator {
	createTitle(dateTime: DateTime): string;
	createEvents(hostname: string, events: UserEvent[]): string;
	getNewLine(): string;
}
