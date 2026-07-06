import { describe, expect, it } from "vitest";
import { StyledFormatter } from "./styled";

describe("StyledFormatter", () => {
	describe("formatRawText", () => {
		it("converts newlines to <br>", () => {
			const formatter = new StyledFormatter();
			expect(formatter.formatRawText("line1\nline2\nline3")).toBe(
				"line1<br>line2<br>line3",
			);
		});

		it("leaves text without newlines unchanged", () => {
			const formatter = new StyledFormatter();
			expect(formatter.formatRawText("no newlines")).toBe("no newlines");
		});
	});
});
