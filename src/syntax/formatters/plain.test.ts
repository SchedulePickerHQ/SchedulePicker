import { describe, expect, it } from "vitest";
import { PlainFormatter } from "./plain";

describe("PlainFormatter", () => {
	describe("formatRawText", () => {
		it("returns text as-is", () => {
			const formatter = new PlainFormatter();
			expect(formatter.formatRawText("line1\nline2")).toBe("line1\nline2");
		});
	});
});
