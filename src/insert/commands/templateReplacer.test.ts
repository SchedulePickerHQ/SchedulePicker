import { describe, expect, it } from "vitest";
import {
	convertNewLines,
	replaceDayPlaceholders,
	replaceEventPlaceholders,
} from "./templateReplacer";
import { createMockFormatter, createMockTemplateDeps } from "./testHelpers";

describe("convertNewLines", () => {
	it("converts newlines to the given newline", () => {
		expect(convertNewLines("line1\nline2\nline3", "<br>")).toBe(
			"line1<br>line2<br>line3",
		);
	});

	it("normalizes CRLF and CR as well", () => {
		expect(convertNewLines("a\r\nb\rc", "<br>")).toBe("a<br>b<br>c");
	});

	it("leaves text unchanged for plain newline", () => {
		expect(convertNewLines("line1\nline2", "\n")).toBe("line1\nline2");
	});
});

describe("replaceDayPlaceholders", () => {
	it("replaces {%TODAY%} with formatted date", async () => {
		const deps = createMockTemplateDeps();
		const result = await replaceDayPlaceholders("Today is {%TODAY%}", deps);
		expect(result).toMatch(/Today is \d{4}\/\d{2}\/\d{2} \(Mon\)/);
	});

	it("replaces {%NEXT_BUSINESS_DAY%} using getNextBusinessDay", async () => {
		const deps = createMockTemplateDeps();
		const result = await replaceDayPlaceholders(
			"Next: {%NEXT_BUSINESS_DAY%}",
			deps,
		);
		expect(result).toContain("2025/01/16");
		expect(deps.getNextBusinessDay).toHaveBeenCalledWith("example.cybozu.com");
	});

	it("leaves text unchanged when no placeholders", async () => {
		const deps = createMockTemplateDeps();
		const result = await replaceDayPlaceholders("no placeholders", deps);
		expect(result).toBe("no placeholders");
	});

	it("replaces multiple occurrences", async () => {
		const deps = createMockTemplateDeps();
		const result = await replaceDayPlaceholders(
			"{%TODAY%} and {%TODAY%}",
			deps,
		);
		const parts = result.split(" and ");
		expect(parts[0]).toBe(parts[1]);
	});
});

describe("replaceEventPlaceholders", () => {
	it("replaces {%TODAY_EVENTS%} with formatted events", async () => {
		const deps = createMockTemplateDeps();
		const result = await replaceEventPlaceholders(
			"Events: {%TODAY_EVENTS%}",
			deps,
			createMockFormatter(),
		);
		expect(result).toBe("Events: event1\nevent2");
		expect(deps.getUserEvents).toHaveBeenCalled();
	});

	it("skips fetching when no event placeholders", async () => {
		const deps = createMockTemplateDeps();
		await replaceEventPlaceholders(
			"no placeholders",
			deps,
			createMockFormatter(),
		);
		expect(deps.getUserEvents).not.toHaveBeenCalled();
		expect(deps.loadPeriodEventSetting).not.toHaveBeenCalled();
	});

	it("replaces multiple event placeholders", async () => {
		const deps = createMockTemplateDeps();
		const result = await replaceEventPlaceholders(
			"{%TODAY_EVENTS%}\n---\n{%TOMORROW_EVENTS%}",
			deps,
			createMockFormatter(),
		);
		expect(result).toBe("event1\nevent2\n---\nevent1\nevent2");
		expect(deps.getUserEvents).toHaveBeenCalledTimes(2);
	});
});
