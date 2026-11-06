import { useEffect, useRef } from "react";
import { Calendar, Layers, ArrowUpRight } from "lucide-react";
import { APP_INFO } from "@/constants/app-info";

interface StackCardData {
	id: string;
	step: string;
	title: string;
	duration: string;
	description: string;
	meta: {
		label: string;
		value: string;
		isAccent?: boolean;
	}[];
	actionLink?: {
		label: string;
		url: string;
	};
}

const STACK_CARDS: StackCardData[] = [
	{
		id: "tier-1",
		step: "01",
		title: "Activate base 12-month tier",
		duration: "Months 0 – 12",
		description:
			'Select Tier 1 in the extension popup and open the Google One plans page. Clicking "Get discount" injects the base promotional offer SKU into Google Play checkout, unlocking your first year at verified $0.00.',
		meta: [
			{ label: "Extension Tier", value: "Tier 1 · 12M" },
			{ label: "Target Account", value: "New or clean plan" },
			{ label: "Introductory Rate", value: "$0.00 Verified", isAccent: true },
			{ label: "Plan Benefits", value: "5TB + Gemini Advanced" },
		],
	},
	{
		id: "tier-2",
		step: "02",
		title: "Stack first 6-month extension",
		duration: "Months 12 – 18",
		description:
			"Once your Tier 1 subscription is active, switch to Tier 2 in the popup and refresh the plans page. Google One recognizes the secondary promo SKU as an extension layer, advancing your renewal date by 6 months.",
		meta: [
			{ label: "Extension Tier", value: "Tier 2 · 6M (Stack 1)" },
			{ label: "Prerequisite", value: "Active Tier 1 plan" },
			{ label: "Charged Today", value: "$0.00 Verified", isAccent: true },
			{ label: "Extended Total", value: "18 Months (+6M)" },
		],
	},
	{
		id: "tier-3",
		step: "03",
		title: "Stack second 6-month extension",
		duration: "Months 18 – 24",
		description:
			"Select Tier 3 in the extension and trigger checkout one final time. Google One stacks this tertiary layer on top of the previous two, reaching the maximum allowable cap of 24 consecutive months.",
		meta: [
			{ label: "Extension Tier", value: "Tier 3 · 6M (Stack 2)" },
			{ label: "Prerequisite", value: "Active Tier 2 plan" },
			{ label: "Charged Today", value: "$0.00 Verified", isAccent: true },
			{ label: "Cumulative Total", value: "24 Months (Max)" },
		],
	},
	{
		id: "disarm",
		step: "04",
		title: "Cancel renewal in Google Play",
		duration: "Permanent safety",
		description:
			"After securing all 24 months, open Google Play Subscriptions and cancel auto-renew. Google honors the entire remaining 2-year promotional window, ensuring zero surprise charges when the term concludes.",
		meta: [
			{ label: "Target Console", value: "Google Play Store" },
			{ label: "Action", value: "Cancel renewal" },
			{ label: "Promo Period", value: "100% Retained", isAccent: true },
			{ label: "Future Charges", value: "$0.00 Guaranteed" },
		],
		actionLink: {
			label: "Open Google Play Subscriptions",
			url: APP_INFO.googlePlaySubsUrl,
		},
	},
];

export function StackingSection() {
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

				// Scale down subtly from 1 down to ~0.95 as next card stacks on top
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
			<div className="container mx-auto max-w-4xl px-4 sm:px-6">
				{/* Section Header */}
				<div className="mx-auto max-w-2xl text-center">
					<div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3.5 py-1 text-xs font-medium text-foreground backdrop-blur-md">
						<Layers className="size-3.5 text-primary" />
						<span>Stacking Sequence</span>
					</div>
					<h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
						How stacking works.
					</h2>
					<p className="mt-3 text-base text-muted-foreground sm:text-lg">
						Google One accepts promotional tokens consecutively. Follow these four steps to stack
						offers up to 24 months at verified zero cost.
					</p>
				</div>

				{/* Sticky Cards Container */}
				<div ref={containerRef} className="relative mt-16 sm:mt-24">
					{STACK_CARDS.map((card, idx) => {
						// Top sticky offset: each subsequent card pins slightly lower
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
								className="sticky mb-12 rounded-3xl border border-white/12 bg-card/95 p-6 shadow-2xl backdrop-blur-xl sm:mb-16 sm:p-8"
							>
								{/* Header Row */}
								<div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-5">
									<div className="flex items-center gap-3">
										<span className="flex size-7 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
											{card.step}
										</span>
										<h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
											{card.title}
										</h3>
									</div>

									<div className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/30 px-3 py-1 font-mono text-xs font-medium text-muted-foreground">
										<Calendar className="size-3 text-primary" />
										<span>{card.duration}</span>
									</div>
								</div>

								{/* Narrative Description */}
								<p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
									{card.description}
								</p>

								{/* Metadata Grid */}
								<div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/50 pt-5 sm:grid-cols-4">
									{card.meta.map((item, mIdx) => (
										<div key={mIdx}>
											<div className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
												{item.label}
											</div>
											<div
												className={`mt-1 text-sm font-semibold ${
													item.isAccent ? "text-primary" : "text-foreground"
												}`}
											>
												{item.value}
											</div>
										</div>
									))}
								</div>

								{/* Action Link for final disarm step */}
								{card.actionLink && (
									<div className="mt-5 border-t border-border/50 pt-4">
										<a
											href={card.actionLink.url}
											target="_blank"
											rel="noreferrer"
											className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
										>
											<span>{card.actionLink.label}</span>
											<ArrowUpRight className="size-3.5" />
										</a>
									</div>
								)}
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
