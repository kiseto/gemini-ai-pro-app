import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FaqSection() {
	const [openIdx, setOpenIdx] = useState<number | null>(0);

	const faqs = [
		{
			q: "Why is a US Google payment profile recommended?",
			a: "Google's 5TB AI Premium promotional offer tokens are geographically configured for the US billing region. Using a US profile (such as a sales-tax-exempt postal code like 97201 in Oregon) ensures zero tax surcharge is calculated during the $0.00 verification stage.",
		},
		{
			q: "How does the Checkout Safety Guard protect me?",
			a: "The safety guard runs directly inside Google Play's checkout iframe (`tokenized.play.google.com`). It inspects the live rendered pricing terms. If words like 'free trial' and '$0.00' are confirmed, it displays a green safety banner. If it detects immediate charge wording like 'charged today' or 'pay now', it immediately surfaces a prominent warning instructing you not to proceed.",
		},
		{
			q: "How does the 2-Year Stacking sequence work?",
			a: "Google One supports stacking promotional layers consecutively. You begin by activating Tier 1 (12 Months). Once active on your account, switching to Tier 2 (6 Months SS) and clicking 'Get discount' again extends your expiration date by 6 months. Finally, applying Tier 3 adds another 6 months, bringing your cumulative total to 24 months (2 full years).",
		},
		{
			q: "Will I ever be automatically charged at the end of the promotional period?",
			a: "No, as long as you visit play.google.com/store/account/subscriptions once your stacking is complete and cancel auto-renew. Your promotional benefits remain 100% active for the entire duration, and Google will simply revert your storage when the promo term ends rather than billing your card.",
		},
		{
			q: "Where are the promo tokens defined and can I supply my own?",
			a: "Promo tokens are externalized into environment variables (.env). If you have your own custom tokens or Google updates their promo keys, you can open the extension popup's 'Tokens' tab (unlocked by tapping the version badge 5 times) and input custom overrides, which are saved privately in your browser's local extension storage.",
		},
		{
			q: "Is this extension secure and client-side only?",
			a: "Yes. The entire extension codebase runs locally in your browser. There is no remote backend, no telemetry tracking, and no external API requests made outside of Google's own official domains (one.google.com and play.google.com).",
		},
	];

	return (
		<section id="faq" className="relative py-24 sm:py-32">
			<div className="container mx-auto max-w-4xl px-4 sm:px-6">
				<div className="text-center">
					<div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3.5 py-1 text-xs font-medium text-foreground backdrop-blur-md">
						<HelpCircle className="size-3.5 text-primary" />
						<span>Clear Answers</span>
					</div>
					<h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
						Frequently Asked Questions.
					</h2>
					<p className="mt-3 text-base text-muted-foreground sm:text-lg">
						Everything you need to know about Google AI Pro promotional tiers and checkout safety.
					</p>
				</div>

				<div className="mt-16 space-y-4">
					{faqs.map((faq, idx) => {
						const isOpen = openIdx === idx;
						return (
							<div
								key={idx}
								className="overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-xs transition-all duration-200 hover:border-primary/40"
							>
								<button
									type="button"
									onClick={() => setOpenIdx(isOpen ? null : idx)}
									className="flex w-full items-center justify-between p-6 text-left transition-colors"
								>
									<span className="text-base font-bold tracking-tight text-foreground sm:text-lg">
										{faq.q}
									</span>
									<div
										className={`ml-4 flex size-8 shrink-0 items-center justify-center rounded-full border border-border/80 bg-muted/40 transition-transform duration-300 ${
											isOpen ? "rotate-180 bg-primary/10 text-primary" : "text-muted-foreground"
										}`}
									>
										<ChevronDown className="size-4" />
									</div>
								</button>

								{isOpen && (
									<div className="border-t border-border/50 px-6 pt-4 pb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
										{faq.a}
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
