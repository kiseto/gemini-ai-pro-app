import fs from "fs";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import webExtension from "vite-plugin-web-extension";
import manifest from "./src/extension/manifest.json" with { type: "json" };
import { APP_INFO } from "./src/constants/app-info.ts";

export default defineConfig(() => {
	return {
		publicDir: false,
		plugins: [
			react(),
			tailwindcss(),
			webExtension({
				disableAutoLaunch: true,
				skipManifestValidation: true,
				manifest: () => ({
					...manifest,
					name: APP_INFO.name,
					description: APP_INFO.shortDescription,
					action: {
						...manifest.action,
						default_title: APP_INFO.name,
					},
					icons: {
						"16": "icons/16.png",
						"32": "icons/32.png",
						"48": "icons/48.png",
						"128": "icons/128.png",
						"192": "icons/192.png",
					},
				}),
				htmlViteConfig: {
					publicDir: false,
					build: {
						outDir: "dist-ext",
					},
				},
				scriptViteConfig: {
					publicDir: false,
					build: {
						outDir: "dist-ext",
					},
					define: {
						"import.meta": "{}",
					},
				},
				watchFilePaths: ["src/**/*", "vite.ext.config.ts"],
			}),
			{
				name: "clean-and-copy-extension-assets",
				closeBundle() {
					const distExt = path.resolve(import.meta.dirname, "./dist-ext");
					const srcIcons = path.resolve(import.meta.dirname, "./public/icons");
					const destIcons = path.join(distExt, "icons");

					// Ensure only extension icons are present
					if (fs.existsSync(srcIcons)) {
						fs.mkdirSync(destIcons, { recursive: true });
						fs.cpSync(srcIcons, destIcons, { recursive: true });
					}

					// Remove any web-only assets if copied by bundler
					const unusedAssets = [
						path.join(distExt, "images"),
						path.join(distExt, "favicon.ico"),
						path.join(distExt, "site.webmanifest"),
						path.join(distExt, "og-image.png"),
						path.join(distExt, "robots.txt"),
						path.join(distExt, "sitemap.xml"),
						path.join(distExt, "llms.txt"),
						path.join(distExt, "llms-full.txt"),
						path.join(distExt, "404.html"),
					];

					for (const item of unusedAssets) {
						if (fs.existsSync(item)) {
							fs.rmSync(item, { recursive: true, force: true });
						}
					}
				},
			},
		],
		resolve: {
			alias: {
				"@": path.resolve(import.meta.dirname, "./src"),
			},
		},
		build: {
			outDir: "dist-ext",
			emptyOutDir: false,
		},
	};
});
