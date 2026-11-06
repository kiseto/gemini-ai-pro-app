import { useRef, useState, useEffect } from "react";
import { Lock, ChevronLeft, ChevronRight, CheckCircle2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface KeebyCardData {
	id: string;
	badge: string;
	title: string;
	subtitle: string;
	metric: string;
	metricLabel: string;
	description: string;
	visual: "guard" | "interceptor" | "privacy" | "vault" | "hud";
}

const KEEBY_CARDS: KeebyCardData[] = [
	{
		id: "guard",
		badge: "Safety Sentry",
		title: "The $0.00 Guard",
		subtitle: "Active checkout inspection",
		metric: "$0.00",
		metricLabel: "Price Verification",
		description:
			"Scans Google Play iframe terms in real time. Renders a prominent green verification banner for authentic trials, or instantly alarms if a paid fee is detected.",
		visual: "guard",
	},
	{
		id: "interceptor",
		badge: "Execution Engine",
		title: "Zero-Latency Patch",
		subtitle: "In-memory request hook",
		metric: "< 1ms",
		metricLabel: "Overhead",
		description:
			"Injects directly into the page's MAIN execution world. Patches Google One SKU protobuf payloads without external network proxies or middleware latency.",
		visual: "interceptor",
	},
	{
		id: "privacy",
		badge: "Air-Gapped",
		title: "Zero Telemetry",
		subtitle: "Private browser sandbox",
		metric: "100%",
		metricLabel: "Client-Side",
		description:
			"No remote backend. No analytics. No session harvesting. Your Google credentials and promotional tokens never leave your browser's local sandbox.",
		visual: "privacy",
	},
	{
		id: "vault",
		badge: "Stealth Discovery",
		title: "Developer Vault",
		subtitle: "5-click easter egg",
		metric: "Hidden",
		metricLabel: "Access Mode",
		description:
			"Tap the version badge 5 times in the extension header to unlock private token override inputs and advanced protobuf inspection options.",
		visual: "vault",
	},
	{
		id: "hud",
		badge: "Live Overlay",
		title: "On-Page HUD Pill",
		subtitle: "Discreet bottom-right dock",
		metric: "Real-Time",
		metricLabel: "State Feedback",
		description:
			"A sleek, dark-mode status pill floats on one.google.com to verify active promo mounting, current tier, and stacking state at a single glance.",
		visual: "hud",
	},
];

export function KeebyShowcase() {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);
	const [activeIndex, setActiveIndex] = useState(0);

	const updateScrollButtons = () => {
		const el = scrollContainerRef.current;
		if (!el) return;

		setCanScrollLeft(el.scrollLeft > 20);
		setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);

		// Calculate active card index based on scroll position
		const cardWidth = 360; // Approximate card width + gap
		const newIndex = Math.min(
			Math.max(Math.round(el.scrollLeft / cardWidth), 0),
			KEEBY_CARDS.length - 1,
		);
		setActiveIndex(newIndex);
	};

	useEffect(() => {
		const el = scrollContainerRef.current;
		if (!el) return;

		updateScrollButtons();
		el.addEventListener("scroll", updateScrollButtons, { passive: true });
		window.addEventListener("resize", updateScrollButtons);

		return () => {
			el.removeEventListener("scroll", updateScrollButtons);
			window.removeEventListener("resize", updateScrollButtons);
		};
	}, []);

	const scrollByAmount = (direction: "left" | "right") => {
		const el = scrollContainerRef.current;
		if (!el) return;
		const offset = direction === "left" ? -400 : 400;
		el.scrollBy({ left: offset, behavior: "smooth" });
	};

	const scrollToCard = (idx: number) => {
		const el = scrollContainerRef.current;
		if (!el) return;
		const targetCard = el.children[idx] as HTMLElement;
		if (targetCard) {
			targetCard.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
		}
	};

	return (
		<section id="features" className="relative overflow-hidden py-24 sm:py-32">
			{/* Subtle warm ambient backdrop */}
			<div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

			<div className="container mx-auto max-w-6xl px-4 sm:px-6">
				{/* Section Header with Keeby-style navigation pills */}
				<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3.5 py-1 text-xs font-medium text-foreground backdrop-blur-md">
							<Sparkles className="size-3.5 text-primary" />
							<span>Engineered Architecture</span>
						</div>
						<h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
							Built with Apple Precision.
						</h2>
						<p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
							Minimalist interface, zero bloat, and surgical request interception designed for
							reliability.
						</p>
					</div>

					{/* Desktop Navigation Pill Controls */}
					<div className="hidden items-center gap-3 sm:flex">
						<button
							type="button"
							onClick={() => scrollByAmount("left")}
							disabled={!canScrollLeft}
							aria-label="Scroll left"
							className="flex size-11 items-center justify-center rounded-full border border-border/80 bg-card text-foreground shadow-xs transition-all hover:bg-muted active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
						>
							<ChevronLeft className="size-5" />
						</button>
						<button
							type="button"
							onClick={() => scrollByAmount("right")}
							disabled={!canScrollRight}
							aria-label="Scroll right"
							className="flex size-11 items-center justify-center rounded-full border border-border/80 bg-card text-foreground shadow-xs transition-all hover:bg-muted active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
						>
							<ChevronRight className="size-5" />
						</button>
					</div>
				</div>

				{/* 
				  Horizontal Scroll Container on Desktop / Fluid Snap on Mobile
				  No-scrollbar styling with smooth momentum touch scrolling
				*/}
				<div
					ref={scrollContainerRef}
					className="mt-12 flex snap-x snap-mandatory [scrollbar-width:none] gap-6 overflow-x-auto pt-2 pb-6 [-ms-overflow-style:none] sm:gap-8 [&::-webkit-scrollbar]:hidden"
				>
					{KEEBY_CARDS.map((card, idx) => (
						<div
							key={card.id}
							className="group relative flex w-[85vw] max-w-[380px] shrink-0 snap-center flex-col justify-between rounded-3xl border border-border/80 bg-card/90 p-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-2xl sm:w-[380px]"
						>
							{/* Card Ambient Glow */}
							<div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-radial from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

							{/* Top Metric Header */}
							<div>
								<div className="flex items-center justify-between">
									<Badge
										variant="secondary"
										className="px-3 py-1 font-mono text-[11px] font-medium"
									>
										{card.badge}
									</Badge>
									<span className="font-mono text-xs font-semibold text-muted-foreground">
										0{idx + 1} / 05
									</span>
								</div>

								<div className="mt-8">
									<div className="font-mono text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
										{card.metric}
									</div>
									<div className="mt-1 font-mono text-xs font-semibold tracking-wider text-primary uppercase">
										{card.metricLabel}
									</div>
								</div>

								<h3 className="mt-6 text-xl font-bold tracking-tight text-foreground">
									{card.title}
								</h3>
								<p className="mt-2 text-xs font-medium text-muted-foreground">{card.subtitle}</p>

								<p className="mt-4 text-xs leading-relaxed text-muted-foreground sm:text-sm">
									{card.description}
								</p>
							</div>

							{/* Card Visual Micro-Interface */}
							<div className="mt-8 rounded-2xl border border-border/60 bg-muted/30 p-4">
								{card.visual === "guard" && (
									<div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
										<CheckCircle2 className="size-5 shrink-0" />
										<div className="leading-tight">
											<div className="font-bold">Play Guard Verified</div>
											<div className="text-[11px] font-normal opacity-90">
												$0.00 Free Trial Confirmed
											</div>
										</div>
									</div>
								)}

								{card.visual === "interceptor" && (
									<div className="space-y-1 font-mono text-[11px] text-muted-foreground">
										<div className="flex items-center justify-between text-foreground">
											<span>Target SKU:</span>
											<span className="font-bold text-primary">subs_variant</span>
										</div>
										<div className="truncate rounded bg-background/60 px-2 py-1 text-[10px]">
											subs:com.google...red:g1.2tb.ai
										</div>
									</div>
								)}

								{card.visual === "privacy" && (
									<div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
										<div className="flex items-center gap-2 text-emerald-500">
											<Lock className="size-4" />
											<span className="font-semibold">Air-Gapped</span>
										</div>
										<span className="text-[11px]">Local Sandbox</span>
									</div>
								)}

								{card.visual === "vault" && (
									<div className="flex items-center justify-between font-mono text-xs">
										<span className="text-muted-foreground">Header Easter Egg</span>
										<Badge variant="outline" className="font-mono text-[10px]">
											5 Clicks
										</Badge>
									</div>
								)}

								{card.visual === "hud" && (
									<div className="flex items-center justify-between font-mono text-xs">
										<div className="flex items-center gap-2">
											<span className="size-2 animate-pulse rounded-full bg-emerald-500" />
											<span className="font-bold text-foreground">AI Pro Mounted</span>
										</div>
										<span className="text-primary">Tier 1 · 12M</span>
									</div>
								)}
							</div>
						</div>
					))}
				</div>

				{/* Progress Indicator Dots for Mobile & Desktop Navigation */}
				<div className="mt-6 flex items-center justify-center gap-2">
					{KEEBY_CARDS.map((_, idx) => (
						<button
							key={idx}
							type="button"
							onClick={() => scrollToCard(idx)}
							aria-label={`Go to slide ${idx + 1}`}
							className={`h-1.5 rounded-full transition-all duration-300 ${
								activeIndex === idx ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"
							}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
