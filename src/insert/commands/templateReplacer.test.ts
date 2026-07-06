import { describe, expect, it } from "vitest";
import {
	convertNewLines,
	fetchEventsForPlaceholders,
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

describe("fetchEventsForPlaceholders", () => {
	it("fetches events once per placeholder in the text", async () => {
		const deps = createMockTemplateDeps();
		const result = await fetchEventsForPlaceholders(
			"{%TODAY_EVENTS%}\n---\n{%TOMORROW_EVENTS%}",
			deps,
		);
		expect([...result.keys()]).toEqual([
			"{%TODAY_EVENTS%}",
			"{%TOMORROW_EVENTS%}",
		]);
		expect(deps.getUserEvents).toHaveBeenCalledTimes(2);
	});

	it("skips fetching when no event placeholders", async () => {
		const deps = createMockTemplateDeps();
		const result = await fetchEventsForPlaceholders("no placeholders", deps);
		expect(result.size).toBe(0);
		expect(deps.getUserEvents).not.toHaveBeenCalled();
		expect(deps.loadPeriodEventSetting).not.toHaveBeenCalled();
	});
});

describe("replaceEventPlaceholders", () => {
	it("replaces {%TODAY_EVENTS%} with formatted events", () => {
		const result = replaceEventPlaceholders(
			"Events: {%TODAY_EVENTS%}",
			new Map([["{%TODAY_EVENTS%}", []]]),
			createMockFormatter(),
			"example.cybozu.com",
		);
		expect(result).toBe("Events: event1\nevent2");
	});

	it("replaces multiple event placeholders", () => {
		const result = replaceEventPlaceholders(
			"{%TODAY_EVENTS%}\n---\n{%TOMORROW_EVENTS%}",
			new Map([
				["{%TODAY_EVENTS%}", []],
				["{%TOMORROW_EVENTS%}", []],
			]),
			createMockFormatter(),
			"example.cybozu.com",
		);
		expect(result).toBe("event1\nevent2\n---\nevent1\nevent2");
	});
});
