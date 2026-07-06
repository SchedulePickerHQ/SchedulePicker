import { describe, expect, it, vi } from "vitest";
import { GetEventsError } from "../../schedule/events";
import { TemplateCommand } from "./templateCommand";
import { createMockFormatter, createMockTemplateDeps } from "./testHelpers";
import type { DecorationType } from "./types";

describe("TemplateCommand", () => {
	it("loads template and inserts replaced result", async () => {
		const deps = createMockTemplateDeps({
			loadTemplateText: vi.fn().mockResolvedValue("Hello {%TODAY%}"),
		});
		await new TemplateCommand(deps).execute();
		expect(deps.loadTemplateText).toHaveBeenCalled();
		expect(deps.paste).toHaveBeenCalledWith(
			expect.stringContaining("Hello"),
			expect.stringContaining("Hello"),
		);
	});

	it("converts template newlines per representation", async () => {
		const deps = createMockTemplateDeps({
			loadTemplateText: vi.fn().mockResolvedValue("line1\nline2\nline3"),
			createFormatter: vi.fn((decoration: DecorationType) =>
				decoration === "styled"
					? createMockFormatter({
							getNewLine: vi.fn().mockReturnValue("<br>"),
						})
					: createMockFormatter(),
			),
		});
		await new TemplateCommand(deps).execute();
		expect(deps.paste).toHaveBeenCalledWith(
			"line1\nline2\nline3",
			"line1<br>line2<br>line3",
		);
	});

	it("omits styled html when decoration is plain", async () => {
		const deps = createMockTemplateDeps({
			loadTemplateText: vi.fn().mockResolvedValue("line1\nline2"),
			loadDecorationSetting: vi.fn().mockResolvedValue("plain"),
		});
		await new TemplateCommand(deps).execute();
		expect(deps.paste).toHaveBeenCalledWith("line1\nline2", undefined);
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
