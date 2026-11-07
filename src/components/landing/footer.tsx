import { ArrowUp } from "lucide-react";
import { APP_INFO } from "@/constants/app-info";

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<footer className="relative z-10 -mt-px bg-background pt-16 pb-16 text-xs text-muted-foreground sm:pt-24 sm:pb-24">
			<div className="container mx-auto max-w-6xl px-4 sm:px-6">
				{/* Main Content: Brand Overview & Navigation Columns */}
				<div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
					{/* Brand Column */}
					<div className="max-w-md space-y-3.5">
						<div className="flex items-center gap-2.5">
							<img
								src="/icons/128.png"
								alt={APP_INFO.name}
								title={APP_INFO.name}
								width={36}
								height={36}
								className="size-8 shrink-0 object-contain sm:size-9"
								loading="lazy"
							/>
							<span className="text-base font-bold tracking-tight text-foreground sm:text-lg">
								{APP_INFO.name}
							</span>
						</div>

						<p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
							{APP_INFO.description}
						</p>
					</div>

					{/* Navigation Columns (Clean, Typography-Driven, Zero Icon Clutter) */}
					<div className="grid grid-cols-2 gap-10 sm:gap-16 lg:gap-20">
						{/* Column 1: Portal Navigation */}
						<div className="flex flex-col space-y-4 sm:space-y-5">
							<span className="font-mono text-xs font-semibold tracking-wider text-foreground uppercase">
								Portal
							</span>
							<div className="flex flex-col space-y-2.5 text-xs">
								<a
									href="#preview"
									title="Navigate to Extension Preview Sandbox"
									className="transition-colors hover:text-foreground"
								>
									Extension Sandbox
								</a>
								<a
									href="#stacking"
									title="Navigate to 24-Month Stacking Sequence"
									className="transition-colors hover:text-foreground"
								>
									24-Month Stacking
								</a>
								<a
									href="#install"
									title="Navigate to Extension Installation Guide"
									className="transition-colors hover:text-foreground"
								>
									Installation Guide
								</a>
								<a
									href="#faq"
									title="Navigate to Frequently Asked Questions"
									className="transition-colors hover:text-foreground"
								>
									Questions & Answers
								</a>
								<a
									href="#support"
									title="Navigate to Support and Donations"
									className="transition-colors hover:text-foreground"
								>
									Support Tooling
								</a>
							</div>
						</div>

						{/* Column 2: Resources & Official Platform */}
						<div className="flex flex-col space-y-4 sm:space-y-5">
							<span className="font-mono text-xs font-semibold tracking-wider text-foreground uppercase">
								Resources
							</span>
							<div className="flex flex-col space-y-2.5 text-xs">
								<a
									href={APP_INFO.googleOneUrl}
									target="_blank"
									rel="noreferrer noopener"
									title="Open Google One Plans in a new tab"
									className="transition-colors hover:text-foreground"
								>
									Google One Plans
								</a>
								<a
									href={APP_INFO.releaseZipUrl}
									download="google-ai-pro-portal-v1.0.0.zip"
									target="_blank"
									rel="noreferrer noopener"
									title="Download Google AI Pro Portal Extension (.zip)"
									className="transition-colors hover:text-foreground"
								>
									Download Extension (.zip)
								</a>
								<a
									href={APP_INFO.githubUrl}
									target="_blank"
									rel="noreferrer noopener"
									title="View Google AI Pro Portal on GitHub"
									className="transition-colors hover:text-foreground"
								>
									GitHub Repository
								</a>
								<a
									href={APP_INFO.githubReleasesUrl}
									target="_blank"
									rel="noreferrer noopener"
									title="View Releases and Changelog on GitHub"
									className="transition-colors hover:text-foreground"
								>
									Releases & Changelog
								</a>
								<a
									href={`${APP_INFO.githubUrl}/blob/main/LICENSE`}
									target="_blank"
									rel="noreferrer noopener"
									title="View MIT License on GitHub"
									className="transition-colors hover:text-foreground"
								>
									MIT License
								</a>
								<a
									href={APP_INFO.sitemapUrl}
									target="_blank"
									rel="noreferrer noopener"
									title="View XML Sitemap"
									className="transition-colors hover:text-foreground"
								>
									Sitemap
								</a>
								<a
									href={APP_INFO.llmsUrl}
									target="_blank"
									rel="noreferrer noopener"
									title="View LLM Context (llms.txt)"
									className="transition-colors hover:text-foreground"
								>
									LLM Context (llms.txt)
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Hairline Divider & Bottom Bar */}
				<div className="mt-14 border-t border-border/40 pt-8 sm:mt-16">
					<div className="flex flex-col items-start justify-between gap-4 text-[11px] leading-relaxed text-muted-foreground/75 sm:flex-row sm:items-center">
						<div className="flex flex-col gap-1">
							<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
								<span>
									© {CURRENT_YEAR} {APP_INFO.shortName}.
								</span>
								<span>•</span>
								<span>
									Independent open-source project. Not affiliated with, sponsored by, or endorsed by
									Google LLC or Alphabet Inc.
								</span>
							</div>
							<span className="text-[10px] text-muted-foreground/60">
								Google, Google One, Google Play, and Gemini are trademarks of Google LLC.
							</span>
						</div>

						<button
							type="button"
							onClick={scrollToTop}
							className="inline-flex cursor-pointer items-center gap-1.5 font-mono text-[11px] whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
						>
							<span>Back to top</span>
							<ArrowUp className="size-3" />
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}
