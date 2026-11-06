import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface GuideTabProps {
	onOpenPlaySubs: () => void;
}

interface GuideStep {
	step: number;
	content: ReactNode;
}

const GUIDE_STEPS: GuideStep[] = [
	{
		step: 1,
		content: (
			<>
				Open <b className="text-foreground">one.google.com/plans</b> and ensure your Google Play
				account region is configured for US promotional availability.
			</>
		),
	},
	{
		step: 2,
		content: (
			<>
				Select <b className="text-foreground">Tier 1 · 12 Months</b> in the Tiers tab, then refresh
				the Google One page.
			</>
		),
	},
	{
		step: 3,
		content: (
			<>
				Confirm the floating pill in the bottom right corner displays &ldquo;Offer Mounted&rdquo;.
			</>
		),
	},
	{
		step: 4,
		content: (
			<>
				Click <b className="text-foreground">Get discount</b> on the Google One AI Premium card.
			</>
		),
	},
	{
		step: 5,
		content: (
			<>
				Look at the top of the Google Play checkout popup: Verify the{" "}
				<b className="text-emerald-600 dark:text-emerald-400">Green Banner ($0.00)</b> is visible.
				If red, cancel immediately!
			</>
		),
	},
	{
		step: 6,
		content: (
			<>
				<b className="text-foreground">Stacking 2 Years:</b> After Tier 1 is confirmed, switch to
				Tier 2 (Stack 1) &rarr; refresh &rarr; repeat checkout. Then switch to Tier 3.
			</>
		),
	},
	{
		step: 7,
		content: (
			<>
				Visit Google Play Subscriptions to disable auto-renew so you are never charged at the
				conclusion of the promo period.
			</>
		),
	},
];

export function GuideTab({ onOpenPlaySubs }: GuideTabProps) {
	return (
		<div className="space-y-2.5 p-3 text-xs">
			<div className="rounded-lg border border-border/60 bg-card p-3.5">
				<h3 className="mb-3 font-semibold text-foreground">Step-by-Step Instructions</h3>
				<div className="relative pl-0.5">
					{GUIDE_STEPS.map(({ step, content }, idx) => {
						const isLast = idx === GUIDE_STEPS.length - 1;
						return (
							<div key={step} className="relative flex items-start gap-3 pb-3.5 last:pb-0">
								{/* Vertical Connecting Line */}
								{!isLast && (
									<div
										className="absolute top-5.5 bottom-0 left-2.5 w-0.5 bg-primary/30 dark:bg-primary/40"
										aria-hidden="true"
									/>
								)}

								{/* Step Node */}
								<div className="relative z-10 flex size-5.5 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-card text-[10.5px] font-bold text-primary shadow-2xs">
									{step}
								</div>

								{/* Step Content */}
								<div className="min-w-0 flex-1 pt-0.5 text-[11.5px] leading-relaxed text-muted-foreground">
									{content}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<Button variant="outline" size="sm" onClick={onOpenPlaySubs} className="w-full text-xs">
				Manage Play Subscriptions <ExternalLink className="ml-1.5 size-3" />
			</Button>
		</div>
	);
}
