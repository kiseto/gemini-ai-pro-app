import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FaqSection() {
	const [openIdx, setOpenIdx] = useState<number | null>(0);

	const faqs = [
		{
			q: "Why is a US Google payment profile recommended?",
			a: "Google's 2TB AI Premium promotional offer tokens are geographically configured for the US billing region. Using a US profile (often with a sales-tax-exempt postal code like 97201 in Oregon) ensures zero tax surcharge is calculated during the $0.00 verification stage.",
		},
		{
			q: "How does the Checkout Safety Guard protect me?",
			a: "The safety guard runs directly inside Google Play's checkout iframe (`tokenized.play.google.com`). It reads the live rendered pricing terms. If words like 'free trial' and '$0.00' are confirmed, it displays a green safety banner. If it detects immediate charge wording like 'charged today' or 'pay now', it immediately surfaces a red warning instructing you not to proceed.",
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
			a: "Promo tokens are externalized into environment variables (`.env`). If you have your own custom tokens or Google updates their promo keys, you can open the extension popup's 'Tokens' tab and input custom overrides, which are saved privately in your browser's local extension storage.",
		},
		{
			q: "Is this extension secure and client-side only?",
			a: "Yes. The entire extension codebase runs locally in your browser. There is no remote backend, no telemetry tracking, and no external API requests made outside of Google's own official domains (`one.google.com` and `play.google.com`).",
		},
	];

	return (
		<section id="faq" className="border-t border-border/40 bg-muted/20 py-20">
			<div className="container mx-auto max-w-4xl px-4 sm:px-6">
				<div className="text-center">
					<Badge variant="outline" className="mb-3 px-3 py-1 text-xs">
						Frequently Asked Questions
					</Badge>
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Common Questions &amp; Best Practices
					</h2>
					<p className="mt-3 text-muted-foreground sm:text-base">
						Everything you need to know about Google AI Pro promotional tiers and checkout safety.
					</p>
				</div>

				<div className="mt-12 space-y-3">
					{faqs.map((faq, idx) => {
						const isOpen = openIdx === idx;
						return (
							<div
								key={idx}
								className="overflow-hidden rounded-xl border border-border/60 bg-card transition-all"
							>
								<button
									type="button"
									onClick={() => setOpenIdx(isOpen ? null : idx)}
									className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-foreground transition-colors hover:bg-muted/30 sm:text-base"
								>
									<span>{faq.q}</span>
									<ChevronDown
										className={`ml-4 size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
											isOpen ? "rotate-180 text-foreground" : ""
										}`}
									/>
								</button>
								{isOpen && (
									<div className="border-t border-border/40 bg-muted/10 p-5 pt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
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
