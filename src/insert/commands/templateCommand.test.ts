import { describe, expect, it, vi } from "vitest";
import { TemplateCommand } from "./templateCommand";
import { createMockTemplateDeps } from "./testHelpers";

describe("TemplateCommand", () => {
	it("loads template and inserts replaced result", async () => {
		const deps = createMockTemplateDeps({
			loadTemplateText: vi.fn().mockResolvedValue("Hello {%TODAY%}"),
		});
		await new TemplateCommand(deps).execute();
		expect(deps.loadTemplateText).toHaveBeenCalled();
		expect(deps.insertText).toHaveBeenCalledWith(
			expect.stringContaining("Hello"),
		);
	});

	it("shows error and resets cursor on failure", async () => {
		const deps = createMockTemplateDeps({
			loadTemplateText: vi.fn().mockRejectedValue(new Error("fail")),
		});
		await new TemplateCommand(deps).execute();
		expect(deps.env.showError).toHaveBeenCalledWith("error_get_events");
		const calls = vi.mocked(deps.env.setCursor).mock.calls;
		expect(calls[calls.length - 1]).toEqual(["auto"]);
	});
});
