import { useEffect, useRef } from "react";
import {
	Calendar,
	Check,
	ShieldCheck,
	Sparkles,
	Layers,
	BellOff,
	ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { APP_INFO } from "@/constants/app-info";

interface StackCardData {
	id: string;
	step: string;
	tier: string;
	duration: string;
	cumulative: string;
	subtitle: string;
	description: string;
	specs: { label: string; value: string }[];
	highlights: string[];
	badge: string;
	badgeVariant: "default" | "secondary" | "outline";
	accentGlow: string;
	borderColor: string;
	icon: typeof Layers;
}

const STACK_CARDS: StackCardData[] = [
	{
		id: "tier-1",
		step: "Step 01",
		tier: "Tier 1 · 12 Months Base",
		duration: "12 Months",
		cumulative: "12 Months Total",
		subtitle: "The Foundation Layer",
		description:
			"Applied to fresh or unsubscribed Google accounts. Intercepts the checkout request to inject the base 1-year promotional offer SKU and verify the $0.00 introductory rate.",
		specs: [
			{ label: "Target Account", value: "US Payment Profile" },
			{ label: "Introductory Rate", value: "$0.00 Verified" },
			{ label: "Cloud Storage", value: "5TB Google One" },
			{ label: "AI Model", value: "Gemini Advanced" },
		],
		highlights: [
			"Initial introductory $0.00 Play checkout",
			"Activates base 1-Year AI Premium subscription",
			"Full Google One 5TB benefits & family sharing",
		],
		badge: "Base Subscription",
		badgeVariant: "default",
		accentGlow: "from-amber-500/10 via-orange-500/5 to-transparent",
		borderColor: "border-amber-500/30 dark:border-amber-500/20",
		icon: Sparkles,
	},
	{
		id: "tier-2",
		step: "Step 02",
		tier: "Tier 2 · +6 Months Extension",
		duration: "+6 Months",
		cumulative: "18 Months Total",
		subtitle: "The First Stacking Layer",
		description:
			"Switch to Tier 2 in the extension popup and refresh the Google One plans page. Clicking 'Get discount' mounts the secondary promo token directly onto your active subscription, extending expiration to 18 months.",
		specs: [
			{ label: "Prerequisite", value: "Active Tier 1 Plan" },
			{ label: "Added Time", value: "+6 Calendar Months" },
			{ label: "Checkout Total", value: "$0.00 Verified" },
			{ label: "Auto-Charge", value: "None / Postponed" },
		],
		highlights: [
			"Seamlessly stacks on active Tier 1 plan",
			"Subscription expiration extended by 6 months",
			"Zero disruption to stored files or settings",
		],
		badge: "Extension Layer 1",
		badgeVariant: "secondary",
		accentGlow: "from-orange-500/10 via-amber-500/5 to-transparent",
		borderColor: "border-orange-500/30 dark:border-orange-500/20",
		icon: Layers,
	},
	{
		id: "tier-3",
		step: "Step 03",
		tier: "Tier 3 · +6 Months Second Layer",
		duration: "+6 Months",
		cumulative: "24 Months Total",
		subtitle: "The 2-Year Capstone",
		description:
			"Select Tier 3 in the extension popup and repeat the checkout confirmation. Google One registers the tertiary promotion layer, locking in a full 24 months (2 years) of uninterrupted AI Premium access.",
		specs: [
			{ label: "Prerequisite", value: "Active Tier 2 Plan" },
			{ label: "Cumulative Time", value: "2 Full Years" },
			{ label: "Verified Cost", value: "$0.00 Today" },
			{ label: "Status", value: "Max Stack Reached" },
		],
		highlights: [
			"Reaches maximum 24-month promotional stack",
			"Includes Gemini Advanced across Workspace apps",
			"Zero intermediate renewal charges",
		],
		badge: "Extension Layer 2",
		badgeVariant: "default",
		accentGlow: "from-amber-400/10 via-rose-500/5 to-transparent",
		borderColor: "border-amber-400/30 dark:border-amber-400/20",
		icon: ShieldCheck,
	},
	{
		id: "disarm",
		step: "Step 04",
		tier: "Disarm Auto-Renew · Zero-Risk Exit",
		duration: "Permanent",
		cumulative: "Zero Risk",
		subtitle: "Guaranteed $0.00 Total",
		description:
			"Once all 24 months are stacked, open Google Play Subscriptions and cancel auto-renewal. Google honors your entire 2-year promotional period without billing your card at expiration.",
		specs: [
			{ label: "Destination", value: "play.google.com" },
			{ label: "Action", value: "Cancel Renewal" },
			{ label: "Promotional Life", value: "100% Retained" },
			{ label: "Future Charges", value: "$0.00 Guaranteed" },
		],
		highlights: [
			"Promotional duration stays active for all 24 months",
			"Completely eliminates future automatic billing",
			"Safe, documented, and fully supported by Google Play",
		],
		badge: "Safety Step",
		badgeVariant: "outline",
		accentGlow: "from-emerald-500/10 via-teal-500/5 to-transparent",
		borderColor: "border-emerald-500/30 dark:border-emerald-500/20",
		icon: BellOff,
	},
];

export function StickyCardStack() {
	const containerRef = useRef<HTMLDivElement>(null);
	const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
	const rafRef = useRef<number | null>(null);

	// Setup sticky card stacking scaling logic using requestAnimationFrame
	useEffect(() => {
		// If user prefers reduced motion, skip the scale transformation
		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (prefersReducedMotion) return;

		const updateCardScales = () => {
			const cards = cardRefs.current;
			if (!cards || cards.length === 0) return;

			for (let i = 0; i < cards.length; i++) {
				const currentCard = cards[i];
				if (!currentCard) continue;

				// Next sibling card
				const nextCard = cards[i + 1];
				if (!nextCard) {
					// Last card stays at scale 1
					currentCard.style.transform = "scale(1)";
					currentCard.style.filter = "brightness(1)";
					continue;
				}

				const currentRect = currentCard.getBoundingClientRect();
				const nextRect = nextCard.getBoundingClientRect();

				const cardHeight = currentRect.height || 360;
				// Gap from bottom of current card or top of next card
				const gapToNext = nextRect.top - currentRect.top;

				// Coverage from 0 to 1 as next card pins over this card
				const coverage = Math.min(Math.max(1 - gapToNext / cardHeight, 0), 1);

				// Scale down subtly from 1 down to ~0.94 as next card stacks on top
				const scale = 1 - 0.05 * coverage;
				// Subtly dim the card being covered for physical depth
				const brightness = 1 - 0.12 * coverage;

				currentCard.style.transform = `scale(${scale.toFixed(4)})`;
				currentCard.style.filter = `brightness(${brightness.toFixed(3)})`;
				currentCard.style.transformOrigin = "50% 0%";
			}
		};

		const onScroll = () => {
			if (rafRef.current !== null) return;
			rafRef.current = window.requestAnimationFrame(() => {
				updateCardScales();
				rafRef.current = null;
			});
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll, { passive: true });
		// Initial calculation
		updateCardScales();

		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
			if (rafRef.current !== null) {
				window.cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}
		};
	}, []);

	return (
		<section id="stacking" className="relative py-24 sm:py-32">
			<div className="container mx-auto max-w-5xl px-4 sm:px-6">
				{/* Section Header */}
				<div className="mx-auto max-w-2xl text-center">
					<div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3.5 py-1 text-xs font-medium text-foreground backdrop-blur-md">
						<Layers className="size-3.5 text-primary" />
						<span>24-Month Stacking Architecture</span>
					</div>
					<h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
						Stacking That Compounds.
					</h2>
					<p className="mt-3 text-base text-muted-foreground sm:text-lg">
						Four precision steps to turn an introductory trial into two full years of Google AI Pro
						at verified zero dollar cost.
					</p>
				</div>

				{/* Sticky Cards Container */}
				<div ref={containerRef} className="relative mt-16 sm:mt-24">
					{STACK_CARDS.map((card, idx) => {
						const Icon = card.icon;
						// Top sticky offset: each subsequent card pins slightly lower (top: calc(84px + var(--i) * 16px))
						const topOffset = `calc(88px + ${idx} * 16px)`;

						return (
							<div
								key={card.id}
								ref={(el) => {
									cardRefs.current[idx] = el;
								}}
								style={{
									top: topOffset,
									zIndex: idx + 1,
									willChange: "transform",
									transition: "transform 100ms linear, filter 100ms linear",
								}}
								className={`sticky mb-12 rounded-3xl border ${card.borderColor} bg-card/95 p-6 shadow-2xl backdrop-blur-xl sm:mb-16 sm:p-10`}
							>
								{/* Subtle inner background ambient light */}
								<div
									className={`pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br ${card.accentGlow}`}
								/>

								{/* Top Header Row */}
								<div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-5">
									<div className="flex items-center gap-3">
										<div className="flex size-10 items-center justify-center rounded-2xl border border-border/80 bg-muted/60 text-primary shadow-xs">
											<Icon className="size-5" />
										</div>
										<div>
											<span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
												{card.step}
											</span>
											<h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
												{card.tier}
											</h3>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<Badge variant={card.badgeVariant} className="px-3 py-1 text-xs font-medium">
											{card.badge}
										</Badge>
										<div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/40 px-3 py-1 font-mono text-xs font-semibold text-foreground">
											<Calendar className="size-3 text-primary" />
											<span>{card.cumulative}</span>
										</div>
									</div>
								</div>

								{/* Content Grid */}
								<div className="mt-6 grid gap-6 sm:grid-cols-12 sm:gap-8">
									{/* Left: Narrative Description & Highlights */}
									<div className="space-y-4 sm:col-span-7">
										<p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
											{card.description}
										</p>

										<div className="space-y-2.5 pt-2">
											{card.highlights.map((hl, hIdx) => (
												<div key={hIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
													<div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
														<Check className="size-3" />
													</div>
													<span className="text-foreground/90">{hl}</span>
												</div>
											))}
										</div>

										{card.id === "disarm" && (
											<div className="pt-2">
												<a
													href={APP_INFO.googlePlaySubsUrl}
													target="_blank"
													rel="noreferrer"
													className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-muted/60 px-4 py-2 text-xs font-semibold text-foreground transition-all hover:bg-muted"
												>
													Open Google Play Subscriptions
													<ArrowUpRight className="size-3.5 text-primary" />
												</a>
											</div>
										)}
									</div>

									{/* Right: Technical Specifications Card */}
									<div className="sm:col-span-5">
										<div className="rounded-2xl border border-border/70 bg-muted/30 p-4 sm:p-5">
											<h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
												Layer Specifications
											</h4>
											<dl className="mt-3 divide-y divide-border/50 text-xs sm:text-sm">
												{card.specs.map((spec, sIdx) => (
													<div key={sIdx} className="flex items-center justify-between py-2">
														<dt className="text-muted-foreground">{spec.label}</dt>
														<dd className="font-mono font-medium text-foreground">{spec.value}</dd>
													</div>
												))}
											</dl>
										</div>
									</div>
								</div>
							</div>
						);
					})}

					{/* 
					  Tail element: 40vh empty element at the bottom of the container 
					  so the last sticky card stays pinned until user scrolls past it.
					*/}
					<div className="h-[40vh] w-full" aria-hidden="true" />
				</div>
			</div>
		</section>
	);
}
