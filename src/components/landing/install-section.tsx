import { useState } from "react";
import {
	Download,
	Copy,
	Check,
	ExternalLink,
	ShieldCheck,
	FolderArchive,
	ToggleRight,
	FolderCheck,
} from "lucide-react";
import { APP_INFO } from "@/constants/app-info";

interface StepItem {
	num: string;
	title: string;
	instruction: string;
	detail: string;
	icon: typeof FolderArchive;
}

const INSTALL_STEPS: StepItem[] = [
	{
		num: "01",
		title: "Extract the release archive",
		instruction:
			"Download the pre-compiled extension ZIP archive and unpack it into a permanent folder on your drive (e.g. Documents/Extensions).",
		detail:
			"Chromium loads extension files directly from this directory—keep it saved in a permanent location.",
		icon: FolderArchive,
	},
	{
		num: "02",
		title: "Enable Developer mode",
		instruction:
			'Open your extensions manager via chrome://extensions. Locate the "Developer mode" toggle in the top-right corner and turn it on.',
		detail: "This reveals the unpacked extension management toolbar across all Chromium browsers.",
		icon: ToggleRight,
	},
	{
		num: "03",
		title: "Load unpacked extension",
		instruction:
			'Click "Load unpacked" in the top-left toolbar, select the extracted folder (containing manifest.json), and confirm.',
		detail:
			"The Google AI Pro Portal icon will appear in your browser toolbar, ready for live offer injection.",
		icon: FolderCheck,
	},
];

export function InstallSection() {
	const [copied, setCopied] = useState(false);

	const copyExtensionUrl = () => {
		navigator.clipboard.writeText("chrome://extensions");
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<section id="install" className="relative py-24 sm:py-32">
			<div className="container mx-auto max-w-5xl px-4 sm:px-6">
				{/* Section Header */}
				<div className="mx-auto max-w-2xl text-center">
					<div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3.5 py-1 text-xs font-medium text-foreground backdrop-blur-md">
						<ShieldCheck className="size-3.5 text-primary" />
						<span>Manual Installation</span>
					</div>
					<h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
						Install the extension.
					</h2>
					<p className="mt-3 text-base text-muted-foreground sm:text-lg">
						Load the pre-compiled Manifest V3 build directly into Chrome, Brave, Edge, or any
						Chromium browser.
					</p>
				</div>

				{/* Split Command Deck Layout */}
				<div className="mt-16 grid items-start gap-8 lg:grid-cols-12 lg:gap-8">
					{/* Left: Download & Station Card */}
					<div className="rounded-3xl border border-white/12 bg-card/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:col-span-5">
						<div className="flex items-center justify-between gap-3">
							<span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
								Release Archive
							</span>
							<span className="rounded-full border border-border/80 bg-muted/40 px-2.5 py-0.5 font-mono text-xs font-medium text-muted-foreground">
								v{APP_INFO.version} · MV3
							</span>
						</div>

						<h3 className="mt-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
							{APP_INFO.name}
						</h3>
						<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
							Zero network middleware or external proxies. The entire extension operates 100%
							locally within your browser.
						</p>

						{/* Action Buttons */}
						<div className="mt-6 flex flex-col gap-3">
							<a
								href={APP_INFO.releaseZipUrl}
								target="_blank"
								rel="noreferrer noopener"
								className="group relative flex h-11 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full border border-white/60 bg-linear-to-b from-white via-[#fafafa] to-[#e8e8e8] px-6 text-sm font-semibold text-neutral-900 shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,1)] transition-all duration-200 hover:from-white hover:to-[#f2f2f2] active:scale-[0.98]"
							>
								<Download className="size-4" />
								<span>Download Extension (.zip)</span>
							</a>

							<a
								href={APP_INFO.githubReleasesUrl}
								target="_blank"
								rel="noreferrer noopener"
								className="flex h-10 items-center justify-center gap-2 rounded-full border border-border/80 bg-muted/30 px-5 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground"
							>
								<span>GitHub Releases</span>
								<ExternalLink className="size-3 text-muted-foreground" />
							</a>
						</div>

						{/* Divider */}
						<div className="my-6 border-t border-border/50" />

						{/* Browser Shortcut Helper */}
						<div>
							<div className="text-xs font-medium text-foreground">Browser shortcut</div>
							<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
								Browsers block web links to internal pages. Copy and paste into your URL bar:
							</p>

							<div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-border/80 bg-background/80 p-1.5 pl-3">
								<code className="font-mono text-xs text-foreground select-all">
									chrome://extensions
								</code>
								<button
									type="button"
									onClick={copyExtensionUrl}
									className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/80 bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground transition-all hover:bg-muted active:scale-95"
									aria-label="Copy extensions URL"
								>
									{copied ? (
										<>
											<Check className="size-3 text-emerald-500" />
											<span>Copied</span>
										</>
									) : (
										<>
											<Copy className="size-3" />
											<span>Copy</span>
										</>
									)}
								</button>
							</div>
						</div>
					</div>

					{/* Right: Vertical Connected Timeline Card */}
					<div className="rounded-3xl border border-white/12 bg-card/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:col-span-7">
						<div className="border-b border-border/50 pb-5">
							<h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
								Three-step installation
							</h3>
							<p className="mt-1 text-xs text-muted-foreground sm:text-sm">
								Takes under 60 seconds. No CLI or build tools required.
							</p>
						</div>

						{/* Connected Vertical Timeline */}
						<div className="relative mt-8 space-y-8 pl-8 before:absolute before:top-3 before:bottom-3 before:left-3.5 before:w-px before:bg-border/60 sm:pl-10">
							{INSTALL_STEPS.map((step) => {
								const Icon = step.icon;
								return (
									<div key={step.num} className="relative">
										{/* Step Number Dot Anchor */}
										<div className="absolute -left-8 flex size-7 items-center justify-center rounded-full border border-border/80 bg-background font-mono text-xs font-bold text-primary shadow-xs sm:-left-10">
											{step.num}
										</div>

										<div>
											<div className="flex items-center gap-2">
												<Icon className="size-4 text-primary" />
												<h4 className="text-base font-bold text-foreground">{step.title}</h4>
											</div>
											<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
												{step.instruction}
											</p>
											<div className="mt-2.5 rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-xs text-muted-foreground/90">
												{step.detail}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
