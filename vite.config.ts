import fs from "fs";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		{
			name: "generate-404-html",
			closeBundle() {
				const distDir = path.resolve(import.meta.dirname, "./dist");
				const indexPath = path.join(distDir, "index.html");
				const notFoundPath = path.join(distDir, "404.html");
				if (fs.existsSync(indexPath)) {
					fs.copyFileSync(indexPath, notFoundPath);
				}
			},
		},
	],
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "./src"),
		},
	},
});
