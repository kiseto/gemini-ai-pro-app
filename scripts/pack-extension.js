import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const manifest = JSON.parse(fs.readFileSync("./src/extension/manifest.json", "utf8"));
const version = manifest.version || "1.0.0";

const outputDir = "releases";
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}

const zipName = path.join(outputDir, `google-ai-pro-portal-v${version}.zip`);

console.log(`Packaging extension to ${zipName}...`);

try {
	if (fs.existsSync(zipName)) {
		fs.unlinkSync(zipName);
	}

	// Compress-Archive is a native PowerShell cmdlet available on Windows
	console.log("Running PowerShell Compress-Archive...");
	execSync(
		`powershell -Command "Compress-Archive -Path dist-ext\\* -DestinationPath '${zipName}' -Force"`,
	);

	console.log(`\n Successfully created ${zipName}`);
	console.log("You can now load unpacked or distribute this zip archive.");
} catch (error) {
	console.error("Failed to zip extension:", error.message);
	process.exit(1);
}
