import { useState } from "react";
import {
	Download,
	FolderArchive,
	ToggleRight,
	CheckSquare,
	Copy,
	Check,
	Terminal,
	ExternalLink,
	ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APP_INFO } from "@/constants/app-info";

export function InstallSection() {
	const [copied, setCopied] = useState(false);

	const copyExtensionUrl = () => {
		navigator.clipboard.writeText("chrome://extensions");
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const steps = [
		{
			num: "01",
			icon: FolderArchive,
			title: "Unpack Archive",
			desc: "Download the pre-compiled extension release archive and extract the ZIP file to a permanent folder on your local drive.",
		},
		{
			num: "02",
			icon: ToggleRight,
			title: "Enable Developer Mode",
			desc: "Open your browser extensions manager. Locate the Developer mode toggle in the top-right corner and switch it ON.",
		},
		{
			num: "03",
			icon: CheckSquare,
			title: "Load Unpacked",
			desc: "Click 'Load unpacked' in the top-left toolbar and select the extracted extension folder containing manifest.json.",
		},
	];

	return (
		<section id="install" className="relative py-24 sm:py-32">
			<div className="container mx-auto max-w-5xl px-4 sm:px-6">
				{/* Section Header */}
				<div className="mx-auto max-w-2xl text-center">
					<div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3.5 py-1 text-xs font-medium text-foreground backdrop-blur-md">
						<ShieldCheck className="size-3.5 text-primary" />
						<span>Quick Installation</span>
					</div>
					<h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
						Up and Running in 60 Seconds.
					</h2>
					<p className="mt-3 text-base text-muted-foreground sm:text-lg">
						Distributed as an unpacked Manifest V3 developer extension for total transparency, local
						safety, and zero telemetry.
					</p>
				</div>

				{/* Download Hero Banner */}
				<div className="mt-16 overflow-hidden rounded-3xl border border-primary/30 bg-card p-6 shadow-xl backdrop-blur-xl sm:p-10">
					<div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<div className="flex items-center gap-2.5">
								<h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
									{APP_INFO.name}
								</h3>
								<Badge className="bg-primary font-mono text-xs text-primary-foreground">
									v{APP_INFO.version}
								</Badge>
							</div>
							<p className="mt-2 text-sm text-muted-foreground">
								Production build ready for Chrome, Brave, Edge, and Chromium browsers.
							</p>
						</div>

						<div className="flex flex-wrap items-center gap-3">
							<Button size="lg" asChild className="gap-2 shadow-md shadow-primary/20">
								<a href={APP_INFO.releaseZipUrl} target="_blank" rel="noreferrer noopener">
									<Download className="size-4" />
									Download Extension (.zip)
								</a>
							</Button>
							<Button variant="outline" size="lg" asChild className="gap-2">
								<a href={APP_INFO.githubReleasesUrl} target="_blank" rel="noreferrer noopener">
									GitHub Releases
									<ExternalLink className="size-3.5 text-muted-foreground" />
								</a>
							</Button>
						</div>
					</div>

					{/* 3 Steps Row */}
					<div className="mt-10 grid gap-6 sm:grid-cols-3">
						{steps.map((step) => {
							const Icon = step.icon;
							return (
								<div
									key={step.num}
									className="relative flex flex-col justify-between rounded-2xl border border-border/80 bg-muted/30 p-6 transition-all hover:border-primary/40"
								>
									<div>
										<div className="flex items-center justify-between">
											<div className="flex size-10 items-center justify-center rounded-xl border border-border/80 bg-background text-primary shadow-xs">
												<Icon className="size-5" />
											</div>
											<span className="font-mono text-xs font-bold text-muted-foreground">
												{step.num}
											</span>
										</div>

										<h4 className="mt-5 text-base font-bold text-foreground">{step.title}</h4>
										<p className="mt-2 text-xs leading-relaxed text-muted-foreground">
											{step.desc}
										</p>
									</div>
								</div>
							);
						})}
					</div>

					{/* Copy URL Helper */}
					<div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/60 bg-muted/40 p-4 sm:flex-row">
						<div className="flex items-center gap-3 text-xs text-muted-foreground">
							<Terminal className="size-4 text-primary" />
							<span>Quick browser shortcut to open the extensions page:</span>
						</div>

						<div className="flex items-center gap-2">
							<code className="rounded-lg border border-border bg-background px-3 py-1 font-mono text-xs text-foreground">
								chrome://extensions
							</code>
							<Button
								variant="outline"
								size="sm"
								onClick={copyExtensionUrl}
								className="gap-1.5 text-xs font-medium"
							>
								{copied ? (
									<>
										<Check className="size-3 text-emerald-500" />
										Copied
									</>
								) : (
									<>
										<Copy className="size-3" />
										Copy URL
									</>
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
