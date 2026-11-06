import { Download, FolderArchive, ToggleRight, CheckSquare, Pin, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APP_INFO } from "@/constants/app-info";

export function InstallGuide() {
	return (
		<section id="install" className="py-20">
			<div className="container mx-auto max-w-6xl px-4 sm:px-6">
				<div className="mx-auto max-w-2xl text-center">
					<Badge variant="outline" className="mb-3 px-3 py-1 text-xs">
						Quick Installation Guide
					</Badge>
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Install in Chrome, Brave, or Edge in 60 Seconds
					</h2>
					<p className="mt-3 text-muted-foreground sm:text-base">
						Because this tool interacts with Google checkout requests, it is distributed as an
						unpacked Manifest V3 developer extension for maximum security and transparency.
					</p>
				</div>

				<div className="mt-12 grid gap-8 lg:grid-cols-12">
					{/* Left Column: Direct Download & Visual Steps */}
					<div className="space-y-4 lg:col-span-7">
						<div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
							<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<div>
									<div className="flex items-center gap-2">
										<h3 className="text-lg font-bold text-foreground">
											{APP_INFO.name} v{APP_INFO.version}
										</h3>
										<Badge>Ready to Load</Badge>
									</div>
									<p className="mt-1 text-xs text-muted-foreground">
										Pre-built ZIP archive containing all compiled bundles and manifest assets.
									</p>
								</div>

								<div className="flex flex-wrap items-center gap-2">
									<Button size="lg" asChild className="shrink-0 gap-2 shadow-sm">
										<a
											href={APP_INFO.releaseZipUrl}
											target="_blank"
											rel="noreferrer noopener"
										>
											<Download className="size-4" />
											Download .ZIP
										</a>
									</Button>
									<Button variant="outline" size="lg" asChild className="shrink-0">
										<a
											href={APP_INFO.githubReleasesUrl}
											target="_blank"
											rel="noreferrer noopener"
										>
											All Releases
										</a>
									</Button>
								</div>
							</div>
						</div>

						{/* 4 Simple Steps */}
						<div className="space-y-3">
							<div className="flex items-start gap-3.5 rounded-xl border border-border/60 bg-card p-4">
								<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
									<FolderArchive className="size-4" />
								</div>
								<div>
									<h4 className="text-sm font-semibold text-foreground">
										Step 1: Unzip the Archive
									</h4>
									<p className="mt-0.5 text-xs text-muted-foreground">
										Extract the downloaded ZIP archive to a folder on your computer (e.g., in your
										Documents or Projects directory).
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3.5 rounded-xl border border-border/60 bg-card p-4">
								<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
									<ToggleRight className="size-4" />
								</div>
								<div>
									<h4 className="text-sm font-semibold text-foreground">
										Step 2: Enable Developer Mode in Chrome
									</h4>
									<p className="mt-0.5 text-xs text-muted-foreground">
										Navigate to{" "}
										<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
											chrome://extensions
										</code>{" "}
										in your browser and flip the <b>Developer mode</b> switch in the top-right
										corner.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3.5 rounded-xl border border-border/60 bg-card p-4">
								<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
									<CheckSquare className="size-4" />
								</div>
								<div>
									<h4 className="text-sm font-semibold text-foreground">
										Step 3: Click &ldquo;Load unpacked&rdquo;
									</h4>
									<p className="mt-0.5 text-xs text-muted-foreground">
										Click the <b>Load unpacked</b> button in the upper-left corner and select the
										extracted extension directory (or the{" "}
										<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
											dist-ext
										</code>{" "}
										folder).
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3.5 rounded-xl border border-border/60 bg-card p-4">
								<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
									<Pin className="size-4" />
								</div>
								<div>
									<h4 className="text-sm font-semibold text-foreground">
										Step 4: Pin to Browser Toolbar
									</h4>
									<p className="mt-0.5 text-xs text-muted-foreground">
										Click the Extensions puzzle icon in Chrome and pin <b>{APP_INFO.name}</b> for
										one-click access anytime you are on Google One.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column: Build from Source */}
					<div className="lg:col-span-5">
						<div className="flex h-full flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
							<div>
								<div className="flex items-center gap-2">
									<Terminal className="size-5 text-primary" />
									<h3 className="text-base font-bold text-foreground">Build from Source Code</h3>
								</div>
								<p className="mt-2 text-xs text-muted-foreground">
									Prefer building locally? The entire monorepo builds in under 2 seconds using Vite:
								</p>

								<div className="mt-4 space-y-2 rounded-xl border border-border/40 bg-muted/60 p-4 font-mono text-xs text-foreground">
									<div className="text-muted-foreground"># Clone this repository</div>
									<div>git clone {APP_INFO.githubUrl}.git</div>
									<div className="pt-1 text-muted-foreground"># Install dependencies</div>
									<div>npm install</div>
									<div className="pt-1 text-muted-foreground"># Build the Chrome extension</div>
									<div>npm run build:ext</div>
									<div className="pt-1 text-muted-foreground"># Pack release ZIP (optional)</div>
									<div>npm run pack:ext</div>
								</div>

								<div className="mt-4 space-y-2 text-xs text-muted-foreground">
									<div className="flex items-center gap-2">
										<span className="size-1.5 rounded-full bg-emerald-500" />
										<span>
											Output directory: <code className="font-mono text-foreground">dist-ext/</code>
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="size-1.5 rounded-full bg-emerald-500" />
										<span>
											Release ZIP: <code className="font-mono text-foreground">releases/*.zip</code>
										</span>
									</div>
								</div>
							</div>

							<div className="mt-6 border-t border-border/60 pt-4">
								<Button variant="outline" size="sm" asChild className="w-full">
									<a href={APP_INFO.githubUrl} target="_blank" rel="noreferrer">
										View on GitHub
									</a>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
