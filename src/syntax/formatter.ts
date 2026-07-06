import type { DecorationType } from "../insert/commands/types";
import type { UserEvent } from "../schedule/events";
import type { DateTime } from "../utils/datetime";
import { PlainFormatter } from "./formatters/plain";
import { StyledFormatter } from "./formatters/styled";

export interface Formatter {
	createTitle(dateTime: DateTime): string;
	createEvents(hostname: string, events: UserEvent[]): string;
	getNewLine(): string;
	/** ユーザーが入力した生テキストをこのフォーマットの表現に変換する */
	formatRawText(text: string): string;
}

export function createFormatter(decoration: DecorationType): Formatter {
	switch (decoration) {
		case "styled":
			return new StyledFormatter();
		case "plain":
			return new PlainFormatter();
		default:
			throw new Error("Decoration is not implemented.");
	}
}
