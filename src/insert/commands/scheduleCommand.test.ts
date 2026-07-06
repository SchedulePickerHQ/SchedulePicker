import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";
import { GetEventsError } from "../../schedule/events";
import { ScheduleCommand } from "./scheduleCommand";
import { createMockFormatter, createMockScheduleDeps } from "./testHelpers";
import type { DecorationType } from "./types";

describe("ScheduleCommand", () => {
	it("fetches events for the resolved date", async () => {
		const deps = createMockScheduleDeps();
		await new ScheduleCommand(deps).execute();
		expect(deps.getUserEvents).toHaveBeenCalledWith(
			"example.cybozu.com",
			expect.objectContaining({ periodEventIncluded: false }),
		);
	});

	it("uses the resolved date for start/end of day", async () => {
		const deps = createMockScheduleDeps({
			resolveDate: () => dayjs("2025-06-01"),
		});
		await new ScheduleCommand(deps).execute();
		const query = vi.mocked(deps.getUserEvents).mock.calls[0][1];
		expect(query.startTime.format("YYYY-MM-DD")).toBe("2025-06-01");
		expect(query.endTime.format("YYYY-MM-DD")).toBe("2025-06-01");
	});

	it("pastes plain and styled representations when decoration is styled", async () => {
		const deps = createMockScheduleDeps({
			createFormatter: vi.fn((decoration: DecorationType) =>
				decoration === "styled"
					? createMockFormatter({
							createTitle: vi.fn().mockReturnValue("<span>[Title]</span>"),
							createEvents: vi.fn().mockReturnValue("event1<br>event2"),
							getNewLine: vi.fn().mockReturnValue("<br>"),
						})
					: createMockFormatter(),
			),
		});
		await new ScheduleCommand(deps).execute();
		expect(deps.paste).toHaveBeenCalledWith(
			"[Title]\nevent1\nevent2",
			"<span>[Title]</span><br>event1<br>event2",
		);
	});

	it("omits styled html when decoration is plain", async () => {
		const deps = createMockScheduleDeps({
			loadDecorationSetting: vi.fn().mockResolvedValue("plain"),
		});
		await new ScheduleCommand(deps).execute();
		expect(deps.paste).toHaveBeenCalledWith(
			"[Title]\nevent1\nevent2",
			undefined,
		);
	});

	it("sets cursor to progress then auto", async () => {
		const deps = createMockScheduleDeps();
		await new ScheduleCommand(deps).execute();
		expect(deps.env.setCursor).toHaveBeenCalledWith("progress");
		expect(deps.env.setCursor).toHaveBeenCalledWith("auto");
	});

	it("shows error on failure", async () => {
		vi.spyOn(console, "error").mockImplementation(() => {});
		const deps = createMockScheduleDeps({
			getUserEvents: vi.fn().mockRejectedValue(new GetEventsError("fail")),
		});
		await new ScheduleCommand(deps).execute();
		expect(deps.env.showError).toHaveBeenCalledWith("error_get_events");
	});

	it("resets cursor even on error", async () => {
		vi.spyOn(console, "error").mockImplementation(() => {});
		const deps = createMockScheduleDeps({
			getUserEvents: vi.fn().mockRejectedValue(new GetEventsError("fail")),
		});
		await new ScheduleCommand(deps).execute();
		const calls = vi.mocked(deps.env.setCursor).mock.calls;
		expect(calls[calls.length - 1]).toEqual(["auto"]);
	});

	it("passes periodEventIncluded setting", async () => {
		const deps = createMockScheduleDeps({
			loadPeriodEventSetting: vi.fn().mockResolvedValue(true),
		});
		await new ScheduleCommand(deps).execute();
		expect(deps.getUserEvents).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({ periodEventIncluded: true }),
		);
	});

	it("uses decoration setting for formatter", async () => {
		const deps = createMockScheduleDeps({
			loadDecorationSetting: vi.fn().mockResolvedValue("plain"),
		});
		await new ScheduleCommand(deps).execute();
		expect(deps.createFormatter).toHaveBeenCalledWith("plain");
	});

	it("works with async date resolvers", async () => {
		const deps = createMockScheduleDeps({
			resolveDate: async () => dayjs("2025-12-25"),
		});
		await new ScheduleCommand(deps).execute();
		const query = vi.mocked(deps.getUserEvents).mock.calls[0][1];
		expect(query.startTime.format("YYYY-MM-DD")).toBe("2025-12-25");
	});
});
