import { useState } from "react";
import {
	Download,
	ArrowRight,
	ShieldCheck,
	Sparkles,
	CheckCircle2,
	Layers,
	Eye,
	XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OFFER_TIERS, OFFER_TIER_LIST, type OfferTierId } from "@/constants/offers";
import { APP_INFO } from "@/constants/app-info";

export function Hero() {
	const [simulatedTier, setSimulatedTier] = useState<OfferTierId>("12m");
	const [simulatedGuardStatus, setSimulatedGuardStatus] = useState<"safe" | "danger" | null>(
		"safe",
	);

	return (
		<section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
			{/* Subtle decorative glow */}
			<div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

			<div className="container mx-auto max-w-6xl px-4 sm:px-6">
				<div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
					{/* Left Column: Value Proposition */}
					<div className="space-y-6 lg:col-span-7">
						<div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1 text-xs font-medium text-foreground backdrop-blur-xs">
							<span className="flex size-2 animate-pulse rounded-full bg-emerald-500" />
							<span>v{APP_INFO.version} Ready for Google Chrome &amp; Brave</span>
						</div>

						<h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl sm:leading-[1.15]">
							Unlock Google AI Pro with{" "}
							<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
								Real-Time Checkout Protection
							</span>
						</h1>

						<p className="max-w-2xl text-base text-muted-foreground sm:text-lg sm:leading-relaxed">
							A modern, typesafe Chrome extension designed to streamline Google One 2TB AI Premium
							promotional subscriptions. Features multi-tier stacking (up to 2 years) and an
							automated <b className="text-foreground">$0.00 Price Guard</b> to verify free trials
							before you subscribe.
						</p>

						<div className="flex flex-wrap items-center gap-3 pt-2">
							<Button size="lg" asChild className="gap-2 shadow-sm">
								<a href="#install">
									<Download className="size-4" />
									Download Extension (.zip)
								</a>
							</Button>

							<Button size="lg" variant="outline" asChild className="gap-2">
								<a href="#workflow">
									How Stacking Works
									<ArrowRight className="size-4" />
								</a>
							</Button>
						</div>

						{/* Trust Badges */}
						<div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
							<div className="flex items-center gap-2 rounded-lg border border-border/40 bg-card/60 p-2 text-xs font-medium text-muted-foreground">
								<ShieldCheck className="size-4 text-emerald-500" />
								<span>100% Client-Side</span>
							</div>
							<div className="flex items-center gap-2 rounded-lg border border-border/40 bg-card/60 p-2 text-xs font-medium text-muted-foreground">
								<CheckCircle2 className="size-4 text-blue-500" />
								<span>Zero Telemetry</span>
							</div>
							<div className="flex items-center gap-2 rounded-lg border border-border/40 bg-card/60 p-2 text-xs font-medium text-muted-foreground">
								<Sparkles className="size-4 text-violet-500" />
								<span>Manifest V3</span>
							</div>
							<div className="flex items-center gap-2 rounded-lg border border-border/40 bg-card/60 p-2 text-xs font-medium text-muted-foreground">
								<Layers className="size-4 text-amber-500" />
								<span>Up to 2Y Stacking</span>
							</div>
						</div>
					</div>

					{/* Right Column: Live Interactive Extension Simulator */}
					<div className="flex flex-col items-center justify-center lg:col-span-5">
						<div className="w-full max-w-sm rounded-2xl border border-border bg-card p-1 shadow-2xl shadow-primary/5">
							{/* Simulator Chrome Mockup Frame */}
							<div className="overflow-hidden rounded-xl border border-border/50 bg-background">
								{/* Browser Extension Popup Header */}
								<div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-3.5 py-2.5">
									<div className="flex items-center gap-2">
										<img
											src="/icons/32.png"
											alt={APP_INFO.shortName}
											className="size-6 object-contain"
										/>
										<div>
											<div className="flex items-center gap-1.5 leading-none">
												<span className="text-xs font-bold">{APP_INFO.shortName}</span>
												<Badge variant="outline" className="px-1 py-0 text-[9px]">
													v{APP_INFO.version}
												</Badge>
											</div>
											<span className="text-[10px] text-muted-foreground">
												Google One 2TB AI Premium
											</span>
										</div>
									</div>
									<Badge
										variant={simulatedTier !== "off" ? "default" : "secondary"}
										className="text-[10px]"
									>
										{simulatedTier !== "off" ? "Mounted" : "Inactive"}
									</Badge>
								</div>

								{/* Live Simulated Status Banner */}
								<div className="p-3">
									{simulatedTier !== "off" ? (
										<div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-emerald-700 dark:text-emerald-400">
											<CheckCircle2 className="size-3.5 shrink-0" />
											<div className="text-[11px] leading-tight font-medium">
												Active: {OFFER_TIERS[simulatedTier].name}
											</div>
										</div>
									) : (
										<div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-2 text-muted-foreground">
											<div className="size-2 rounded-full bg-muted-foreground/60" />
											<div className="text-[11px] leading-tight">Injection Disabled</div>
										</div>
									)}
								</div>

								{/* Tier Picker Simulator */}
								<div className="space-y-1.5 px-3 pb-3">
									<div className="text-[10px] font-semibold text-muted-foreground uppercase">
										Interactive Tier Selector:
									</div>
									{OFFER_TIER_LIST.slice(0, 3).map((tier) => {
										const isSelected = simulatedTier === tier.id;
										return (
											<button
												key={tier.id}
												type="button"
												onClick={() => setSimulatedTier(tier.id)}
												className={`flex w-full items-center justify-between rounded-lg border p-2 text-left text-xs transition-all ${
													isSelected
														? "border-primary bg-primary/5 font-semibold text-primary"
														: "border-border/60 text-foreground hover:bg-muted/40"
												}`}
											>
												<span className="flex items-center gap-2">
													<span
														className={`size-2.5 rounded-full border ${
															isSelected
																? "border-primary bg-primary"
																: "border-muted-foreground/40"
														}`}
													/>
													<span>{tier.name}</span>
												</span>
												<Badge variant={tier.tagVariant} className="px-1 py-0 text-[9px]">
													{tier.tag}
												</Badge>
											</button>
										);
									})}
								</div>

								{/* Checkout Guard Demonstration Box */}
								<div className="border-t border-border/60 bg-muted/20 p-3">
									<div className="flex items-center justify-between pb-1.5">
										<span className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
											<Eye className="size-3 text-primary" />
											Play Checkout Safety Guard:
										</span>
										<div className="flex gap-1">
											<button
												type="button"
												onClick={() => setSimulatedGuardStatus("safe")}
												className={`rounded px-1.5 py-0.5 text-[9px] font-medium transition-colors ${
													simulatedGuardStatus === "safe"
														? "bg-emerald-600 text-white"
														: "bg-muted text-muted-foreground hover:text-foreground"
												}`}
											>
												$0.00 Trial
											</button>
											<button
												type="button"
												onClick={() => setSimulatedGuardStatus("danger")}
												className={`rounded px-1.5 py-0.5 text-[9px] font-medium transition-colors ${
													simulatedGuardStatus === "danger"
														? "bg-red-600 text-white"
														: "bg-muted text-muted-foreground hover:text-foreground"
												}`}
											>
												Paid Alert
											</button>
										</div>
									</div>

									{simulatedGuardStatus === "safe" ? (
										<div className="rounded-lg border border-emerald-600 bg-emerald-700 p-2 text-white">
											<div className="flex items-center gap-1.5 text-xs font-bold">
												<ShieldCheck className="size-3.5" />
												Verified: $0.00 Free Trial Detected
											</div>
											<p className="mt-0.5 text-[10px] text-emerald-100">
												Safe to subscribe. Terms confirm no charge today.
											</p>
										</div>
									) : (
										<div className="rounded-lg border border-red-600 bg-red-700 p-2 text-white">
											<div className="flex items-center gap-1.5 text-xs font-bold">
												<XCircle className="size-3.5" />
												Warning: Immediate Charge Detected!
											</div>
											<p className="mt-0.5 text-[10px] text-red-100">
												Do not subscribe! Real payment detected. Change tier.
											</p>
										</div>
									)}
								</div>
							</div>
						</div>
						<p className="mt-2.5 text-center text-xs text-muted-foreground">
							Interactive simulation · Click the buttons to test the UI &amp; Safety Guard
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
