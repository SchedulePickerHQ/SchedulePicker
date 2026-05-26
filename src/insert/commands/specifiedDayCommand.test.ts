import { describe, expect, it, vi } from "vitest";
import type { BrowserApi } from "../../utils/browser";
import { SpecifiedDayCommand } from "./specifiedDayCommand";
import type { ScheduleDeps } from "./types";

type SpecifiedDayDeps = Omit<ScheduleDeps, "resolveDate">;

function createMockBrowserApi(overrides?: Partial<BrowserApi>): BrowserApi {
	return {
		hostname: "example.cybozu.com",
		setCursor: vi.fn(),
		showError: vi.fn(),
		getMessage: vi.fn().mockImplementation((key: string) => {
			if (key === "prompt_specified_date_description") return "Enter date";
			return "";
		}),
		prompt: vi.fn().mockReturnValue(null),
		...overrides,
	};
}

function createMockDeps(
	overrides?: Partial<SpecifiedDayDeps>,
): SpecifiedDayDeps {
	const mockFormatter = {
		createTitle: vi.fn().mockReturnValue("[Title]"),
		createEvents: vi.fn().mockReturnValue("events"),
		getNewLine: vi.fn().mockReturnValue("\n"),
	};
	const env = overrides?.env ?? createMockBrowserApi();
	return {
		env,
		loadPeriodEventSetting: vi.fn().mockResolvedValue(false),
		loadSyntaxSetting: vi.fn().mockResolvedValue("html"),
		createFormatter: vi.fn().mockReturnValue(mockFormatter),
		getUserEvents: vi.fn().mockResolvedValue([]),
		insertText: vi.fn(),
		...overrides,
	};
}

describe("SpecifiedDayCommand", () => {
	it("prompts user for date", async () => {
		const env = createMockBrowserApi();
		const deps = createMockDeps({ env });
		await new SpecifiedDayCommand(deps).execute();
		expect(env.prompt).toHaveBeenCalledWith(
			"Enter date",
			expect.stringMatching(/^\d{4}\/\d{2}\/\d{2}$/),
		);
	});

	it("does nothing when user cancels", async () => {
		const deps = createMockDeps({ env: createMockBrowserApi() });
		await new SpecifiedDayCommand(deps).execute();
		expect(deps.getUserEvents).not.toHaveBeenCalled();
	});

	it("shows error for invalid date format", async () => {
		const env = createMockBrowserApi({ prompt: vi.fn().mockReturnValue("bad") });
		const deps = createMockDeps({ env });
		await new SpecifiedDayCommand(deps).execute();
		expect(env.showError).toHaveBeenCalled();
		expect(deps.getUserEvents).not.toHaveBeenCalled();
	});

	it("fetches and inserts events for valid date", async () => {
		const env = createMockBrowserApi({
			prompt: vi.fn().mockReturnValue("2025/01/15"),
		});
		const deps = createMockDeps({ env });
		await new SpecifiedDayCommand(deps).execute();
		expect(deps.getUserEvents).toHaveBeenCalled();
		expect(deps.insertText).toHaveBeenCalled();
	});
});
