import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const manifestPath = path.resolve("./src/extension/manifest.json");
const distExtDir = path.resolve("./dist-ext");
const outputDir = path.resolve("./releases");
const stagingDir = path.resolve("./dist-staging");

if (!fs.existsSync(distExtDir)) {
	console.error("Error: dist-ext folder does not exist. Please run 'npm run build:ext' first.");
	process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const version = manifest.version || "1.0.0";

if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}

const zipName = path.join(outputDir, `google-ai-pro-portal-v${version}.zip`);

console.log(`Packaging extension to ${zipName}...`);

try {
	// Clean previous staging directory and existing zip
	if (fs.existsSync(stagingDir)) {
		fs.rmSync(stagingDir, { recursive: true, force: true });
	}
	if (fs.existsSync(zipName)) {
		fs.unlinkSync(zipName);
	}

	// Prepare clean release structure:
	// dist-staging/
	//   ├── extension/          <-- compiled unpacked extension files
	//   └── INSTRUCTIONS.txt    <-- top-level setup & stacking documentation
	const stagingExtDir = path.join(stagingDir, "extension");
	fs.mkdirSync(stagingExtDir, { recursive: true });

	// Copy dist-ext into staging/extension
	fs.cpSync(distExtDir, stagingExtDir, { recursive: true });

	// Copy release instructions
	const instructionsSrc = path.resolve("./releases/INSTRUCTIONS.txt");

	if (fs.existsSync(instructionsSrc)) {
		fs.copyFileSync(instructionsSrc, path.join(stagingDir, "INSTRUCTIONS.txt"));
		// Also include instructions inside the extension folder for direct access
		fs.copyFileSync(instructionsSrc, path.join(stagingExtDir, "INSTRUCTIONS.txt"));
	}

	// Compress-Archive is a native PowerShell cmdlet available on Windows
	console.log("Running PowerShell Compress-Archive...");
	execSync(
		`powershell -Command "Compress-Archive -Path '${stagingDir}\\*' -DestinationPath '${zipName}' -Force"`,
	);

	// Clean up staging directory
	fs.rmSync(stagingDir, { recursive: true, force: true });

	console.log(`\n Successfully created ${zipName}`);
	console.log("Archive contents:");
	console.log("  - extension/       (Load this folder in chrome://extensions -> Load unpacked)");
	console.log("  - INSTRUCTIONS.txt (Comprehensive English installation & stacking guide)");
} catch (error) {
	if (fs.existsSync(stagingDir)) {
		fs.rmSync(stagingDir, { recursive: true, force: true });
	}
	console.error("Failed to zip extension:", error.message);
	process.exit(1);
}
