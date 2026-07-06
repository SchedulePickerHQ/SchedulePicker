import { describe, expect, it, vi } from "vitest";
import { GetEventsError } from "../../schedule/events";
import { TemplateCommand } from "./templateCommand";
import { createMockTemplateDeps } from "./testHelpers";

describe("TemplateCommand", () => {
	it("parses template into segments and pastes the built content", async () => {
		const deps = createMockTemplateDeps({
			loadTemplateText: vi.fn().mockResolvedValue("Hello\nWorld"),
		});
		await new TemplateCommand(deps).execute();
		expect(deps.buildPasteContent).toHaveBeenCalledWith(
			"styled",
			[{ type: "text", value: "Hello\nWorld" }],
			"example.cybozu.com",
		);
		expect(deps.paste).toHaveBeenCalledWith({
			plainText: "plain",
			html: "html",
		});
	});

	it("passes the decoration setting to buildPasteContent", async () => {
		const deps = createMockTemplateDeps({
			loadTemplateText: vi.fn().mockResolvedValue("Hello"),
			loadDecorationSetting: vi.fn().mockResolvedValue("plain"),
		});
		await new TemplateCommand(deps).execute();
		expect(deps.buildPasteContent).toHaveBeenCalledWith(
			"plain",
			expect.anything(),
			expect.any(String),
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
