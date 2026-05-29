import { describe, expect, it, vi } from "vitest";
import { SpecifiedDayCommand } from "./specifiedDayCommand";
import { createMockBrowserApi, createMockScheduleDeps } from "./testHelpers";
import type { SpecifiedDayDeps } from "./types";

function createMockDeps(
	overrides?: Partial<SpecifiedDayDeps>,
): SpecifiedDayDeps {
	const { resolveDate: _, ...rest } = createMockScheduleDeps();
	const env =
		overrides?.env ??
		createMockBrowserApi({
			getMessage: vi.fn().mockImplementation((key: string) => {
				if (key === "prompt_specified_date_description") return "Enter date";
				return "";
			}),
		});
	return { ...rest, env, ...overrides };
}

describe("SpecifiedDayCommand", () => {
	it("prompts user for date", async () => {
		const env = createMockBrowserApi({
			getMessage: vi.fn().mockReturnValue("Enter date"),
		});
		const deps = createMockDeps({ env });
		await new SpecifiedDayCommand(deps).execute();
		expect(env.prompt).toHaveBeenCalledWith(
			"Enter date",
			expect.stringMatching(/^\d{4}\/\d{2}\/\d{2}$/),
		);
	});

	it("does nothing when user cancels", async () => {
		const deps = createMockDeps();
		await new SpecifiedDayCommand(deps).execute();
		expect(deps.getUserEvents).not.toHaveBeenCalled();
	});

	it("shows error for invalid date format", async () => {
		const env = createMockBrowserApi({
			prompt: vi.fn().mockReturnValue("bad"),
		});
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
		expect(deps.paste).toHaveBeenCalled();
	});
});
