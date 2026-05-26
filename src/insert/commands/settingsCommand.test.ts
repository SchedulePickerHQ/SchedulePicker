import { describe, expect, it, vi } from "vitest";
import { SettingsCommand } from "./settingsCommand";
import type { SettingsDeps } from "./types";

describe("SettingsCommand", () => {
	it("calls sendOpenSettingsPage", async () => {
		const deps: SettingsDeps = {
			sendOpenSettingsPage: vi.fn().mockResolvedValue(undefined),
		};
		await new SettingsCommand(deps).execute();
		expect(deps.sendOpenSettingsPage).toHaveBeenCalled();
	});
});
