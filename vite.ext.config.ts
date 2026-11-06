import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import webExtension from "vite-plugin-web-extension";
import manifest from "./src/extension/manifest.json" with { type: "json" };
import { APP_INFO } from "./src/constants/app-info.ts";

export default defineConfig(() => {
	return {
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
					build: {
						outDir: "dist-ext",
					},
				},
				scriptViteConfig: {
					build: {
						outDir: "dist-ext",
					},
					define: {
						"import.meta": "{}",
					},
				},
				watchFilePaths: ["src/**/*", "vite.ext.config.ts"],
			}),
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
