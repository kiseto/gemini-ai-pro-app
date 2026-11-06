import { Calendar, Plus, Check, HardDrive, Cpu, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { YoutubeIcon } from "@/components/icons";

export function StackingVisualizer() {
	return (
		<section id="stacking" className="border-t border-border/40 bg-muted/20 py-20">
			<div className="container mx-auto max-w-6xl px-4 sm:px-6">
				<div className="mx-auto max-w-2xl text-center">
					<Badge variant="outline" className="mb-3 px-3 py-1 text-xs">
						2-Year Stacking Architecture
					</Badge>
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Stack Consecutive Promotional Tiers Up to 24 Months
					</h2>
					<p className="mt-3 text-muted-foreground sm:text-base">
						Google One allows eligible accounts to stack extension promo layers onto active
						promotional subscriptions, extending your AI Premium tier seamlessly.
					</p>
				</div>

				{/* Stacking Timeline Visualizer */}
				<div className="mt-12 grid gap-4 md:grid-cols-3">
					{/* Tier 1 */}
					<div className="relative flex flex-col justify-between rounded-xl border border-blue-500/30 bg-card p-6 shadow-xs">
						<div>
							<div className="flex items-center justify-between">
								<Badge className="bg-blue-600 hover:bg-blue-700">Step 1 · Base Tier</Badge>
								<span className="font-mono text-xs font-semibold text-muted-foreground">
									Months 0 &ndash; 12
								</span>
							</div>

							<h3 className="mt-4 text-xl font-bold text-foreground">Tier 1: 12 Months</h3>
							<p className="mt-2 text-xs leading-relaxed text-muted-foreground">
								Mount Tier 1 on a fresh or non-subscriber US account. Verifies free trial for your
								first 12 full months of Google AI Pro.
							</p>

							<div className="mt-4 space-y-2 border-t border-border/60 pt-4 text-xs">
								<div className="flex items-center gap-2">
									<Check className="size-3.5 text-blue-500" />
									<span>Initial $0.00 Introductory Checkout</span>
								</div>
								<div className="flex items-center gap-2">
									<Check className="size-3.5 text-blue-500" />
									<span>Base 1-Year AI Premium Active</span>
								</div>
							</div>
						</div>

						<div className="mt-6 flex items-center justify-between rounded-lg bg-blue-500/10 p-3 text-xs font-semibold text-blue-600 dark:text-blue-400">
							<span className="flex items-center gap-1.5">
								<Calendar className="size-3.5" /> Total Duration:
							</span>
							<span>12 Months Free</span>
						</div>
					</div>

					{/* Tier 2 */}
					<div className="relative flex flex-col justify-between rounded-xl border border-indigo-500/30 bg-card p-6 shadow-xs">
						<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-bold text-indigo-600 shadow-xs dark:text-indigo-400">
							<Plus className="mr-0.5 inline size-3" /> Stacking A
						</div>

						<div>
							<div className="flex items-center justify-between">
								<Badge variant="secondary">Step 2 · Extension 1</Badge>
								<span className="font-mono text-xs font-semibold text-muted-foreground">
									Months 12 &ndash; 18
								</span>
							</div>

							<h3 className="mt-4 text-xl font-bold text-foreground">Tier 2: +6 Months (SS)</h3>
							<p className="mt-2 text-xs leading-relaxed text-muted-foreground">
								Switch to Tier 2 in the popup, refresh the plans page, and repeat checkout. The
								subscription expiration extends by 6 additional months.
							</p>

							<div className="mt-4 space-y-2 border-t border-border/60 pt-4 text-xs">
								<div className="flex items-center gap-2">
									<Check className="size-3.5 text-indigo-500" />
									<span>Secondary promo token injection</span>
								</div>
								<div className="flex items-center gap-2">
									<Check className="size-3.5 text-indigo-500" />
									<span>Stacks seamlessly on active subscription</span>
								</div>
							</div>
						</div>

						<div className="mt-6 flex items-center justify-between rounded-lg bg-indigo-500/10 p-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
							<span className="flex items-center gap-1.5">
								<Calendar className="size-3.5" /> Cumulative Duration:
							</span>
							<span>18 Months Free</span>
						</div>
					</div>

					{/* Tier 3 */}
					<div className="relative flex flex-col justify-between rounded-xl border border-violet-500/30 bg-card p-6 shadow-xs">
						<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-bold text-violet-600 shadow-xs dark:text-violet-400">
							<Plus className="mr-0.5 inline size-3" /> Stacking B
						</div>

						<div>
							<div className="flex items-center justify-between">
								<Badge variant="secondary">Step 3 · Extension 2</Badge>
								<span className="font-mono text-xs font-semibold text-muted-foreground">
									Months 18 &ndash; 24
								</span>
							</div>

							<h3 className="mt-4 text-xl font-bold text-foreground">Tier 3: +6 Months</h3>
							<p className="mt-2 text-xs leading-relaxed text-muted-foreground">
								Switch to Tier 3 in the popup and repeat the discount click. Completes the full
								stacking cycle for 24 continuous months.
							</p>

							<div className="mt-4 space-y-2 border-t border-border/60 pt-4 text-xs">
								<div className="flex items-center gap-2">
									<Check className="size-3.5 text-violet-500" />
									<span>Tertiary promo token injection</span>
								</div>
								<div className="flex items-center gap-2">
									<Check className="size-3.5 text-violet-500" />
									<span>24 Months Total Google AI Pro</span>
								</div>
							</div>
						</div>

						<div className="mt-6 flex items-center justify-between rounded-lg bg-violet-500/10 p-3 text-xs font-semibold text-violet-600 dark:text-violet-400">
							<span className="flex items-center gap-1.5">
								<Calendar className="size-3.5" /> Maximum Benefit:
							</span>
							<span>24 Months (2 Full Years)</span>
						</div>
					</div>
				</div>

				{/* What You Receive in Google AI Pro */}
				<div className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8">
					<h3 className="text-lg font-bold text-foreground">
						Features Included with Google AI Pro (2TB AI Premium Tier):
					</h3>
					<div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						<div className="space-y-2">
							<div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
								<HardDrive className="size-4" />
							</div>
							<h4 className="text-sm font-semibold">2,000 GB Cloud Storage</h4>
							<p className="text-xs text-muted-foreground">
								Generous 2 TB storage shared across Google Drive, Gmail, and Google Photos with
								full-resolution backups.
							</p>
						</div>

						<div className="space-y-2">
							<div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
								<Cpu className="size-4" />
							</div>
							<h4 className="text-sm font-semibold">Gemini Advanced Access</h4>
							<p className="text-xs text-muted-foreground">
								Access to Google&apos;s state-of-the-art AI models, 1M+ token context window, and
								priority execution.
							</p>
						</div>

						<div className="space-y-2">
							<div className="flex size-8 items-center justify-center rounded-lg bg-red-500/10 text-red-600">
								<YoutubeIcon className="size-4" />
							</div>
							<h4 className="text-sm font-semibold">YouTube Premium Add-On</h4>
							<p className="text-xs text-muted-foreground">
								Ad-free YouTube playback, background listening, and YouTube Music offline downloads.
							</p>
						</div>

						<div className="space-y-2">
							<div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
								<Users className="size-4" />
							</div>
							<h4 className="text-sm font-semibold">Family Storage Sharing</h4>
							<p className="text-xs text-muted-foreground">
								Share your 2TB storage quota and benefits with up to 5 family members securely.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
