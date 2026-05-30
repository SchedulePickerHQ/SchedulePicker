import { describe, expect, it, vi } from "vitest";
import { DecorationCommand } from "./decorationCommand";
import type { DecorationDeps } from "./types";

function createMockDeps(): DecorationDeps {
	return {
		saveDecorationSetting: vi.fn().mockResolvedValue(undefined),
		sendBuildContextMenu: vi.fn().mockResolvedValue(undefined),
	};
}

describe("DecorationCommand", () => {
	it("saves the specified decoration setting", async () => {
		const deps = createMockDeps();
		const command = new DecorationCommand("styled", deps);
		await command.execute();
		expect(deps.saveDecorationSetting).toHaveBeenCalledWith("styled");
	});

	it("sends build context menu after saving", async () => {
		const deps = createMockDeps();
		const command = new DecorationCommand("styled", deps);
		await command.execute();
		expect(deps.sendBuildContextMenu).toHaveBeenCalled();
	});

	it("calls save before rebuild", async () => {
		const order: string[] = [];
		const deps: DecorationDeps = {
			saveDecorationSetting: vi.fn().mockImplementation(async () => {
				order.push("save");
			}),
			sendBuildContextMenu: vi.fn().mockImplementation(async () => {
				order.push("rebuild");
			}),
		};
		const command = new DecorationCommand("plain", deps);
		await command.execute();
		expect(order).toEqual(["save", "rebuild"]);
	});
});
