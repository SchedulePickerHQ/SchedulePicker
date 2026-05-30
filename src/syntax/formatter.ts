import type { DecorationType } from "../insert/commands/types";
import type { UserEvent } from "../schedule/events";
import type { DateTime } from "../utils/datetime";
import { MinimalFormatter } from "./formatters/minimal";
import { PlainFormatter } from "./formatters/plain";
import { StyledFormatter } from "./formatters/styled";

export interface Formatter {
	createTitle(dateTime: DateTime): string;
	createEvents(hostname: string, events: UserEvent[]): string;
	getNewLine(): string;
}

export function createFormatter(decoration: DecorationType): Formatter {
	switch (decoration) {
		case "styled":
			return new StyledFormatter();
		case "minimal":
			return new MinimalFormatter();
		case "plain":
			return new PlainFormatter();
		default:
			throw new Error("Decoration is not implemented.");
	}
}
