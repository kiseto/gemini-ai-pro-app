import { APP_INFO } from "@/constants/app-info";
import { ArrowUpRight, HelpCircle, MessageSquare, Plus } from "lucide-react";
import { useState } from "react";

interface FaqItem {
	q: string;
	a: string;
}

const FAQS: FaqItem[] = [
	{
		q: "Why is a US Google payment profile recommended?",
		a: "Google configures its 5TB promotional offer SKUs specifically for the US billing region. Setting your payment profile to a US address—especially with a sales-tax-exempt postal code like 97201 in Oregon—ensures Google Play calculates a flat $0.00 checkout without state or regional tax surcharges.",
	},
	{
		q: "How does the Checkout Safety Guard protect me from accidental charges?",
		a: "The safety guard executes directly inside Google Play's tokenized checkout iframe (tokenized.play.google.com). Before you confirm, it inspects the live rendered pricing terms. If terms like 'Free trial' and '$0.00' are verified, it mounts a green safety banner. If it detects any paid terms—such as 'Charged today' or 'Pay now'—it surfaces a prominent red warning instructing you not to proceed.",
	},
	{
		q: "How does the 24-month stacking sequence work?",
		a: "Google One allows promotional SKUs to be applied sequentially as subscription extensions. Activating Tier 1 grants 12 months. Applying Tier 2 stacks an extra 6 months (advancing renewal to month 18). Finally, applying Tier 3 adds another 6 months, locking in the maximum allowable 24 months (2 full years) on a single Google account.",
	},
	{
		q: "Will Google automatically bill my card when the promotional period ends?",
		a: "Not if you cancel renewal. Once all tiers are stacked, open play.google.com/store/account/subscriptions and cancel the subscription. Google's policy guarantees that all 24 months of promotional 5TB storage and Gemini Advanced stay 100% active until expiration, after which your account simply reverts to the free tier with zero charges.",
	},
	{
		q: "Where do promotional tokens come from and how are they kept updated?",
		a: "Promotional offer tokens are extracted directly from active Google One campaign releases and bundled into pre-compiled extension builds. When Google updates or rotates token identifiers, new releases are published to GitHub. The extension also supports local storage overrides, allowing developers to configure custom token parameters without rebuilding from source.",
	},
	{
		q: "Does this extension send any account data or tokens to an external server?",
		a: "None. The extension runs 100% client-side in your browser with zero remote backend, analytics, or telemetry tracking. Network requests only occur between your browser and official Google domains (one.google.com and play.google.com).",
	},
];

export function FaqSection() {
	const [openIdx, setOpenIdx] = useState<number | null>(0);

	return (
		<section id="faq" className="relative py-24 sm:py-32">
			<div className="container mx-auto max-w-6xl px-4 sm:px-6">
				<div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
					{/* Left Column: Sticky Title, Context, and Support Links */}
					<div className="lg:sticky lg:top-24 lg:col-span-4">
						<div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3.5 py-1 text-xs font-medium text-foreground backdrop-blur-md">
							<HelpCircle className="size-3.5 text-primary" />
							<span>Questions & Answers</span>
						</div>

						<h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
							Frequently asked questions.
						</h2>

						<p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
							Technical details about offer injection, checkout safety verification, and Google One
							subscription stacking.
						</p>

						{/* Support / Community Links */}
						<div className="mt-8 divide-y divide-border/60 border-y border-border/60">
							<a
								href={`${APP_INFO.githubUrl}/discussions`}
								target="_blank"
								rel="noreferrer noopener"
								className="group flex items-center justify-between py-3.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
							>
								<span className="flex items-center gap-2.5">
									<MessageSquare className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
									<span>Community Discussions</span>
								</span>
								<ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</a>

							<a
								href={`${APP_INFO.githubUrl}/issues`}
								target="_blank"
								rel="noreferrer noopener"
								className="group flex items-center justify-between py-3.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
							>
								<span className="flex items-center gap-2.5">
									<HelpCircle className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
									<span>Report an Issue</span>
								</span>
								<ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</a>
						</div>
					</div>

					{/* Right Column: Editorial Divider List Accordion */}
					<div className="lg:col-span-8">
						<div className="divide-y divide-border/60">
							{FAQS.map((faq, idx) => {
								const isOpen = openIdx === idx;
								return (
									<div key={idx} className="transition-colors">
										<button
											type="button"
											onClick={() => setOpenIdx(isOpen ? null : idx)}
											className="flex w-full cursor-pointer items-start justify-between gap-4 py-5 text-left transition-colors sm:py-6"
											aria-expanded={isOpen}
										>
											<span
												className={`text-base font-semibold tracking-tight transition-colors sm:text-lg ${
													isOpen ? "text-primary" : "text-foreground hover:text-foreground/90"
												}`}
											>
												{faq.q}
											</span>
											<span
												className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-transform duration-200 ${
													isOpen ? "rotate-45 border-primary text-primary" : ""
												}`}
												aria-hidden="true"
											>
												<Plus className="size-3.5" />
											</span>
										</button>

										{isOpen && (
											<div className="animate-in pb-6 text-sm leading-relaxed text-muted-foreground duration-200 fade-in-50 sm:text-base">
												{faq.a}
											</div>
										)}
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
