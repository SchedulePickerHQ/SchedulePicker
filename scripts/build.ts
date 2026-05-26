import { cpSync, renameSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { build, type InlineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import preprocess from "svelte-preprocess";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");

const sveltePlugin = svelte({ preprocess: preprocess() });

const commonConfig: InlineConfig = {
	root,
	configFile: false,
	logLevel: "warn",
};

async function buildOptionsPage() {
	const optionsRoot = resolve(root, "src/entrypoints/options");
	await build({
		...commonConfig,
		root: optionsRoot,
		plugins: [sveltePlugin],
		build: {
			outDir: dist,
			emptyOutDir: false,
			rollupOptions: {
				input: resolve(optionsRoot, "index.html"),
				output: {
					entryFileNames: "assets/[name].js",
					chunkFileNames: "assets/[name].js",
					assetFileNames: "assets/[name][extname]",
				},
			},
		},
	});
}

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
}

async function main() {
	rmSync(dist, { recursive: true, force: true });

	await buildOptionsPage();
	renameSync(resolve(dist, "index.html"), resolve(dist, "options.html"));
	await Promise.all([
		buildScript("src/entrypoints/background.ts", "background.js"),
		buildScript(
			"src/entrypoints/content.ts",
			"content-scripts/content.js",
		),
	]);
	copyStaticFiles();

	console.log("✔ Build complete");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
