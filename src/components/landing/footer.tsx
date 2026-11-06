import { ExternalLink } from "lucide-react";
import { APP_INFO } from "@/constants/app-info";
import { GithubIcon } from "@/components/icons";

export function Footer() {
	return (
		<footer className="border-t border-border/40 bg-card/60 py-12 text-xs text-muted-foreground">
			<div className="container mx-auto max-w-6xl px-4 sm:px-6">
				<div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
					<div className="space-y-3 md:col-span-2">
						<div className="flex items-center gap-2">
							<img src="/icons/32.png" alt={APP_INFO.name} className="size-7 object-contain" />
							<span className="text-sm font-bold text-foreground">{APP_INFO.name}</span>
						</div>
						<p className="max-w-md text-xs leading-relaxed text-muted-foreground">
							{APP_INFO.description}
						</p>
						<div className="pt-1 text-[11px] text-muted-foreground/80">
							Open-source project licensed under MIT. Built for personal productivity and
							educational research.
						</div>
					</div>

					<div className="space-y-2.5">
						<h4 className="text-xs font-semibold tracking-wider text-foreground uppercase">
							Quick Links
						</h4>
						<ul className="space-y-1.5">
							<li>
								<a
									href={APP_INFO.googleOneUrl}
									target="_blank"
									rel="noreferrer"
									className="flex items-center gap-1 hover:text-foreground"
								>
									Google One Plans <ExternalLink className="size-3" />
								</a>
							</li>
							<li>
								<a
									href={APP_INFO.googlePlaySubsUrl}
									target="_blank"
									rel="noreferrer"
									className="flex items-center gap-1 hover:text-foreground"
								>
									Google Play Subscriptions <ExternalLink className="size-3" />
								</a>
							</li>
							<li>
								<a
									href={APP_INFO.githubUrl}
									target="_blank"
									rel="noreferrer"
									className="flex items-center gap-1 hover:text-foreground"
								>
									GitHub Repository <GithubIcon className="size-3" />
								</a>
							</li>
						</ul>
					</div>

					<div className="space-y-2.5">
						<h4 className="text-xs font-semibold tracking-wider text-foreground uppercase">
							Extension Commands
						</h4>
						<ul className="space-y-1.5 font-mono text-[11px]">
							<li>npm run dev:ext</li>
							<li>npm run build:ext</li>
							<li>npm run pack:ext</li>
						</ul>
					</div>
				</div>

				<div className="mt-8 border-t border-border/40 pt-6 text-[11px] leading-relaxed text-muted-foreground/70">
					<p>
						<b>Disclaimer:</b> {APP_INFO.name} is an independent, open-source tool and is not
						affiliated, endorsed, or sponsored by Google LLC, Alphabet Inc., or any of their
						subsidiaries. &ldquo;Google&rdquo;, &ldquo;Google One&rdquo;, and &ldquo;Gemini&rdquo;
						are trademarks of Google LLC.
					</p>
				</div>
			</div>
		</footer>
	);
}
