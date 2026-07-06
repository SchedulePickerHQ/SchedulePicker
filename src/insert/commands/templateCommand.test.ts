import { describe, expect, it, vi } from "vitest";
import { GetEventsError } from "../../schedule/events";
import { TemplateCommand } from "./templateCommand";
import { createMockFormatter, createMockTemplateDeps } from "./testHelpers";

describe("TemplateCommand", () => {
	it("loads template and inserts replaced result", async () => {
		const deps = createMockTemplateDeps({
			loadTemplateText: vi.fn().mockResolvedValue("Hello {%TODAY%}"),
		});
		await new TemplateCommand(deps).execute();
		expect(deps.loadTemplateText).toHaveBeenCalled();
		expect(deps.paste).toHaveBeenCalledWith(
			expect.stringContaining("Hello"),
			"styled",
		);
	});

	it("converts template newlines to the formatter's newline", async () => {
		const formatter = createMockFormatter({
			getNewLine: vi.fn().mockReturnValue("<br>"),
		});
		const deps = createMockTemplateDeps({
			loadTemplateText: vi.fn().mockResolvedValue("line1\nline2\nline3"),
			createFormatter: vi.fn().mockReturnValue(formatter),
		});
		await new TemplateCommand(deps).execute();
		expect(deps.paste).toHaveBeenCalledWith(
			"line1<br>line2<br>line3",
			"styled",
		);
	});

	it("shows error and resets cursor on failure", async () => {
		vi.spyOn(console, "error").mockImplementation(() => {});
		const deps = createMockTemplateDeps({
			loadTemplateText: vi.fn().mockResolvedValue("{%TODAY_EVENTS%}"),
			getUserEvents: vi.fn().mockRejectedValue(new GetEventsError("fail")),
		});
		await new TemplateCommand(deps).execute();
		expect(deps.env.showError).toHaveBeenCalledWith("error_get_events");
		const calls = vi.mocked(deps.env.setCursor).mock.calls;
		expect(calls[calls.length - 1]).toEqual(["auto"]);
	});
});
