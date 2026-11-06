import { Globe, RefreshCw, MousePointerClick, ShieldCheck, Layers, BellOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function WorkflowSteps() {
	const steps = [
		{
			step: "01",
			icon: Globe,
			title: "Prepare Target Google Account",
			desc: "Sign in to your target Google account on your browser. To qualify for standard promotion terms, ensure your payment profile is set to United States (a tax-exempt ZIP code like 97201 is commonly used for zero-tax addresses).",
		},
		{
			step: "02",
			icon: RefreshCw,
			title: "Select Tier & Refresh Plans Page",
			desc: "Open the extension popup and choose Tier 1 (12 Months). Open one.google.com/plans and refresh once. Confirm the floating pill in the bottom right corner displays 'AI Pro Offer Mounted'.",
		},
		{
			step: "03",
			icon: MousePointerClick,
			title: "Click 'Get discount' on AI Premium",
			desc: "Locate the Google One 2TB AI Premium tier card and click 'Get discount'. Google One will launch the Google Play modal checkout dialog.",
		},
		{
			step: "04",
			icon: ShieldCheck,
			title: "Verify the Checkout Safety Guard",
			desc: "The extension's Play Guard scans the checkout terms. Ensure the green banner confirms '$0.00 Free Trial Detected'. Verify the due today total is $0.00, then click Subscribe.",
		},
		{
			step: "05",
			icon: Layers,
			title: "Stack Additional Tiers (Up to 2Y)",
			desc: "To extend your subscription, open the extension popup, switch to Tier 2 (6 Months SS), refresh one.google.com/plans, and repeat checkout. Follow with Tier 3 for 24 months total.",
		},
		{
			step: "06",
			icon: BellOff,
			title: "Disable Automatic Renewal",
			desc: "Once all layers are stacked, navigate to play.google.com/store/account/subscriptions and cancel auto-renewal. Your full 2-year promotional period remains fully active with zero future surprise charges.",
		},
	];

	return (
		<section id="workflow" className="border-t border-border/40 bg-muted/20 py-20">
			<div className="container mx-auto max-w-6xl px-4 sm:px-6">
				<div className="mx-auto max-w-2xl text-center">
					<Badge variant="outline" className="mb-3 px-3 py-1 text-xs">
						Step-by-Step Walkthrough
					</Badge>
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						How to Complete &amp; Stack Offers
					</h2>
					<p className="mt-3 text-muted-foreground sm:text-base">
						Follow these six simple steps in sequence to safely activate and maximize your Google AI
						Pro benefits.
					</p>
				</div>

				<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{steps.map((item, idx) => {
						const Icon = item.icon;
						return (
							<div
								key={idx}
								className="relative flex flex-col justify-between rounded-xl border border-border/60 bg-card p-6 shadow-xs"
							>
								<div>
									<div className="flex items-center justify-between">
										<span className="font-mono text-2xl font-black text-primary/40">
											{item.step}
										</span>
										<div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
											<Icon className="size-4.5" />
										</div>
									</div>

									<h3 className="mt-4 text-base font-bold text-foreground">{item.title}</h3>
									<p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
