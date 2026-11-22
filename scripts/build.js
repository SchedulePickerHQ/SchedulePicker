import { cpSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { build } from "esbuild";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");

rmSync(dist, { recursive: true, force: true });

await build({
	absWorkingDir: root,
	// キーは dist からの出力パス（拡張子なし）。manifest.json と options.html が参照するパスと揃える
	entryPoints: {
		background: "src/entrypoints/background.ts",
		"content-scripts/content": "src/entrypoints/content.ts",
		"assets/options": "src/entrypoints/options/main.ts",
	},
	outdir: dist,
	bundle: true,
	// content script は ES モジュールとして読み込めないため、依存ごと1ファイルの IIFE にする
	format: "iife",
	// Node の組み込みモジュールを import するとビルドエラーにする。拡張機能の中では動かないため
	platform: "browser",
	// manifest.json の minimum_chrome_version と揃える。Temporal が使える最初の版
	target: "chrome144",
	minify: true,
	logLevel: "warning",
});

cpSync(resolve(root, "manifest.json"), resolve(dist, "manifest.json"));
cpSync(resolve(root, "public"), dist, { recursive: true });
cpSync(
	resolve(root, "src/entrypoints/options/index.html"),
	resolve(dist, "options.html"),
);

console.log("✔ Build complete");
