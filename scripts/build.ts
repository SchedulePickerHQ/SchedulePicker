import { cpSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { build, type InlineConfig } from "vite";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");

const commonConfig: InlineConfig = {
	root,
	configFile: false,
	logLevel: "warn",
};

async function buildScript(entry: string, outFileName: string) {
	await build({
		...commonConfig,
		build: {
			outDir: dist,
			emptyOutDir: false,
			lib: {
				entry: resolve(root, entry),
				formats: ["iife"],
				name: "_",
				fileName: () => outFileName,
			},
			rollupOptions: {
				onwarn(warning, defaultHandler) {
					if (
						warning.message?.includes(
							"has been externalized for browser compatibility",
						)
					)
						return;
					defaultHandler(warning);
				},
				output: {
					extend: true,
				},
			},
		},
	});
}

function copyStaticFiles() {
	cpSync(resolve(root, "manifest.json"), resolve(dist, "manifest.json"));
	cpSync(resolve(root, "public"), dist, { recursive: true });
	cpSync(
		resolve(root, "src/entrypoints/options/index.html"),
		resolve(dist, "options.html"),
	);
}

async function main() {
	rmSync(dist, { recursive: true, force: true });

	await Promise.all([
		buildScript("src/entrypoints/background.ts", "background.js"),
		buildScript("src/entrypoints/content.ts", "content-scripts/content.js"),
		buildScript("src/entrypoints/options/main.ts", "assets/options.js"),
	]);
	copyStaticFiles();

	console.log("✔ Build complete");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
