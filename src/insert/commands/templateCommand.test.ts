import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";
import { TemplateCommand } from "./templateCommand";
import type { TemplateDeps } from "./types";

function createMockDeps(overrides?: Partial<TemplateDeps>): TemplateDeps {
	const mockFormatter = {
		createTitle: vi.fn().mockReturnValue("[Title]"),
		createEvents: vi.fn().mockReturnValue("events"),
		getNewLine: vi.fn().mockReturnValue("\n"),
	};
	return {
		env: {
			hostname: "example.cybozu.com",
			setCursor: vi.fn(),
			showError: vi.fn(),
			getMessage: vi.fn().mockReturnValue(""),
			prompt: vi.fn().mockReturnValue(null),
		},
		loadTemplateText: vi.fn().mockResolvedValue("Hello {%TODAY%}"),
		loadPeriodEventSetting: vi.fn().mockResolvedValue(false),
		loadSyntaxSetting: vi.fn().mockResolvedValue("html"),
		createFormatter: vi.fn().mockReturnValue(mockFormatter),
		getUserEvents: vi.fn().mockResolvedValue([]),
		insertText: vi.fn(),
		getNextBusinessDay: vi.fn().mockResolvedValue(dayjs("2025-01-16")),
		getPreviousBusinessDay: vi.fn().mockResolvedValue(dayjs("2025-01-14")),
		getDayOfWeek: vi.fn().mockReturnValue("Mon"),
		...overrides,
	};
}

describe("TemplateCommand", () => {
	it("loads template and inserts replaced result", async () => {
		const deps = createMockDeps();
		await new TemplateCommand(deps).execute();
		expect(deps.loadTemplateText).toHaveBeenCalled();
		expect(deps.insertText).toHaveBeenCalledWith(
			expect.stringContaining("Hello"),
		);
	});

	it("shows error and resets cursor on failure", async () => {
		const deps = createMockDeps({
			loadTemplateText: vi.fn().mockRejectedValue(new Error("fail")),
		});
		await new TemplateCommand(deps).execute();
		expect(deps.env.showError).toHaveBeenCalledWith("error_get_events");
		const calls = vi.mocked(deps.env.setCursor).mock.calls;
		expect(calls[calls.length - 1]).toEqual(["auto"]);
	});
});
