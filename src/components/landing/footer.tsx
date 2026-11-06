import { ExternalLink } from "lucide-react";
import { APP_INFO } from "@/constants/app-info";
import { GithubIcon } from "@/components/icons";

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
	return (
		<footer className="border-t border-border/60 bg-card/60 py-16 text-xs text-muted-foreground backdrop-blur-md">
			<div className="container mx-auto max-w-6xl px-4 sm:px-6">
				<div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
					{/* Brand Column */}
					<div className="space-y-4 md:col-span-2">
						<div className="flex items-center gap-2.5">
							<img src="/icons/32.png" alt={APP_INFO.name} className="size-7 object-contain" />
							<span className="text-sm font-bold tracking-tight text-foreground">
								{APP_INFO.name}
							</span>
						</div>
						<p className="max-w-md text-xs leading-relaxed text-muted-foreground">
							{APP_INFO.description}
						</p>
						<div className="pt-1 text-[11px] text-muted-foreground/80">
							Open-source project licensed under MIT. Built for personal productivity, transparency,
							and educational research.
						</div>
					</div>

					{/* Navigation Links */}
					<div className="space-y-3">
						<h4 className="font-mono text-xs font-semibold tracking-wider text-foreground uppercase">
							Navigation
						</h4>
						<ul className="space-y-2 text-xs">
							<li>
								<a href="#features" className="transition-colors hover:text-foreground">
									Architecture Specs
								</a>
							</li>
							<li>
								<a href="#stacking" className="transition-colors hover:text-foreground">
									24-Month Stacking
								</a>
							</li>
							<li>
								<a href="#install" className="transition-colors hover:text-foreground">
									Installation Guide
								</a>
							</li>
							<li>
								<a href="#faq" className="transition-colors hover:text-foreground">
									Frequently Asked Questions
								</a>
							</li>
						</ul>
					</div>

					{/* External Resources */}
					<div className="space-y-3">
						<h4 className="font-mono text-xs font-semibold tracking-wider text-foreground uppercase">
							Official Google Links
						</h4>
						<ul className="space-y-2 text-xs">
							<li>
								<a
									href={APP_INFO.googleOneUrl}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
								>
									Google One Plans <ExternalLink className="size-3" />
								</a>
							</li>
							<li>
								<a
									href={APP_INFO.googlePlaySubsUrl}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
								>
									Google Play Subscriptions <ExternalLink className="size-3" />
								</a>
							</li>
							<li>
								<a
									href={APP_INFO.githubUrl}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
								>
									GitHub Repository <GithubIcon className="size-3" />
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
					<div className="font-mono text-[11px] text-muted-foreground">
						© {CURRENT_YEAR} {APP_INFO.name}. All rights reserved.
					</div>
					<div className="font-mono text-[11px] text-muted-foreground/80">
						Not affiliated with or endorsed by Google LLC or Alphabet Inc.
					</div>
				</div>
			</div>
		</footer>
	);
}
