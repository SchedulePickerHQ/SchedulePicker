import { describe, expect, it, vi } from "vitest";
import { parseTemplate, replaceDayPlaceholders } from "./templateParser";
import { createMockTemplateDeps } from "./testHelpers";

// 日付プレースホルダーの展開は曜日名を chrome.i18n から引く
vi.stubGlobal("chrome", {
	i18n: {
		getMessage: vi.fn((key: string) =>
			key.startsWith("day_of_week_") ? "Mon" : key,
		),
	},
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

describe("parseTemplate", () => {
	it("parses text and event placeholders into segments", async () => {
		const deps = createMockTemplateDeps();
		const segments = await parseTemplate(
			"Events:\n{%TODAY_EVENTS%}\nEnd",
			deps,
		);
		expect(segments).toEqual([
			{ type: "text", value: "Events:\n" },
			{ type: "events", events: [] },
			{ type: "text", value: "\nEnd" },
		]);
	});

	it("returns a single text segment when no event placeholders", async () => {
		const deps = createMockTemplateDeps();
		const segments = await parseTemplate("no placeholders", deps);
		expect(segments).toEqual([{ type: "text", value: "no placeholders" }]);
		expect(deps.getUserEvents).not.toHaveBeenCalled();
		expect(deps.loadPeriodEventSetting).not.toHaveBeenCalled();
	});

	it("fetches events once per placeholder", async () => {
		const deps = createMockTemplateDeps();
		const segments = await parseTemplate(
			"{%TODAY_EVENTS%}\n---\n{%TOMORROW_EVENTS%}",
			deps,
		);
		expect(deps.getUserEvents).toHaveBeenCalledTimes(2);
		expect(segments.map((s) => s.type)).toEqual(["events", "text", "events"]);
	});

	it("reuses fetched events for repeated occurrences of a placeholder", async () => {
		const deps = createMockTemplateDeps();
		const segments = await parseTemplate(
			"{%TODAY_EVENTS%}\n{%TODAY_EVENTS%}",
			deps,
		);
		expect(deps.getUserEvents).toHaveBeenCalledTimes(1);
		expect(segments.map((s) => s.type)).toEqual(["events", "text", "events"]);
	});

	it("normalizes CRLF and CR to LF", async () => {
		const deps = createMockTemplateDeps();
		const segments = await parseTemplate("a\r\nb\rc", deps);
		expect(segments).toEqual([{ type: "text", value: "a\nb\nc" }]);
	});

	it("resolves day placeholders as text", async () => {
		const deps = createMockTemplateDeps();
		const segments = await parseTemplate("Today is {%TODAY%}", deps);
		expect(segments).toHaveLength(1);
		expect(segments[0].type).toBe("text");
	});
});
