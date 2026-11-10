import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Sparkles, X, Globe, Layers, BookOpen, Settings2 } from "lucide-react";
import { APP_INFO } from "@/constants/app-info";
import { type OfferTierId } from "@/constants/offers";
import { PopupHeader } from "@/extension/components/popup-header";
import { PopupStatusBanner } from "@/extension/components/popup-status-banner";
import { TiersTab } from "@/extension/components/tiers-tab";
import { GuideTab } from "@/extension/components/guide-tab";
import { TokensTab } from "@/extension/components/tokens-tab";
import { PopupFooter } from "@/extension/components/popup-footer";
import { useDeveloperMode } from "@/extension/hooks/use-developer-mode";
import type { CustomTokensMap } from "@/extension/types";

type TabSection = "tiers" | "guide" | "settings";

interface TabItem {
	id: TabSection;
	label: string;
	icon: typeof Layers;
}

export function PreviewSection() {
	const [isOpen, setIsOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const [activeTab, setActiveTab] = useState<TabSection>("tiers");
	const [selectedLayer, setSelectedLayer] = useState<OfferTierId>("12m");
	const [isOnGoogleOne, setIsOnGoogleOne] = useState(true);
	const [isMounted, setIsMounted] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const { isDevMode, handleVersionClick } = useDeveloperMode();
	const [customTokens, setCustomTokens] = useState<CustomTokensMap>({});
	const [settingsSaved, setSettingsSaved] = useState(false);

	// Dynamic tab items based on developer mode flag
	const tabs: TabItem[] = useMemo(() => {
		const base: TabItem[] = [
			{ id: "tiers", label: "Tiers", icon: Layers },
			{ id: "guide", label: "Guide", icon: BookOpen },
		];
		if (isDevMode) {
			base.push({ id: "settings", label: "Tokens", icon: Settings2 });
		}
		return base;
	}, [isDevMode]);

	const currentTab = !isDevMode && activeTab === "settings" ? "tiers" : activeTab;

	const handleTokenChange = (key: Exclude<OfferTierId, "off">, value: string) => {
		setCustomTokens((prev) => ({ ...prev, [key]: value }));
		setSettingsSaved(false);
	};

	const handleSaveCustomTokens = () => {
		setSettingsSaved(true);
		setTimeout(() => setSettingsSaved(false), 2500);
	};

	const handleResetCustomTokens = () => {
		setCustomTokens({});
		setSettingsSaved(true);
		setTimeout(() => setSettingsSaved(false), 2500);
	};

	const containerRef = useRef<HTMLDivElement>(null);
	const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Smooth fold-up close sequence
	const handleClose = useCallback(() => {
		if (isClosing) return;
		setIsClosing(true);
		closeTimeoutRef.current = setTimeout(() => {
			setIsOpen(false);
			setIsClosing(false);
		}, 200);
	}, [isClosing]);

	// Clean up pending timeouts
	useEffect(() => {
		return () => {
			if (closeTimeoutRef.current) {
				clearTimeout(closeTimeoutRef.current);
			}
		};
	}, []);

	// Close on Escape key
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen && !isClosing) {
				handleClose();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, isClosing, handleClose]);

	// Simulate page reload / remount
	const handleReloadPage = () => {
		setIsRefreshing(true);
		setTimeout(() => {
			setIsMounted(selectedLayer !== "off");
			setIsRefreshing(false);
		}, 600);
	};

	// Switch layer
	const handleSelectLayer = (layer: OfferTierId) => {
		setSelectedLayer(layer);
		if (layer === "off") {
			setIsMounted(false);
		} else if (isOnGoogleOne) {
			setIsMounted(true);
		}
	};

	// Toggle simulated domain
	const handleToggleDomain = () => {
		const nextState = !isOnGoogleOne;
		setIsOnGoogleOne(nextState);
		if (!nextState) {
			setIsMounted(false);
		} else {
			setIsMounted(selectedLayer !== "off");
		}
	};

	return (
		<section
			id="preview"
			className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16 sm:px-6 sm:py-24"
			aria-label="Interactive extension preview"
		>
			<div className="relative z-10 container mx-auto flex max-w-4xl flex-col items-center px-4 sm:px-6">
				{/* Section Header */}
				<div className="mx-auto max-w-2xl text-center">
					<div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3.5 py-1 text-xs font-medium text-foreground backdrop-blur-md">
						<Sparkles className="size-3.5 text-primary" />
						<span>Live Sandbox</span>
					</div>
					<h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
						Take it for a spin.
					</h2>
					<p className="mx-auto mt-3.5 max-w-lg text-base text-muted-foreground sm:text-lg">
						Click the emblem to test tier stacking and checkout protection in real time—no download
						required.
					</p>
				</div>

				{/* Interactive Morphing Stage */}
				<div className="mt-12 flex w-full justify-center">
					{!isOpen ? (
						/* Collapsed State: Plain floating logo with handwritten pointers */
						<div className="relative flex flex-col items-center justify-center py-8 sm:py-10">
							{/* Tight Middle Glow Backdrop (Locked directly behind logo, zero drift or wander) */}
							<div
								className="pointer-events-none absolute top-1/2 left-1/2 size-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.65)_0%,rgba(234,88,12,0.25)_50%,transparent_72%)] blur-2xl sm:size-52"
								aria-hidden="true"
							/>

							{/* Floor reflection beneath logo */}
							<div
								className="pointer-events-none absolute -bottom-4 left-1/2 h-4 w-32 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(245,158,11,0.45)_0%,transparent_75%)] blur-sm sm:w-40"
								aria-hidden="true"
							/>

							{/* Left Decorative Handwritten Hint: Click it */}
							<div
								data-slot="handwritten-hint-left"
								className="pointer-events-none absolute top-2 right-[calc(50%+76px)] z-20 flex flex-col items-end font-handwritten text-xl tracking-normal text-amber-100/90 select-none sm:top-3 sm:right-[calc(50%+96px)] sm:text-2xl"
								aria-hidden="true"
							>
								<span className="-rotate-6 whitespace-nowrap">click it!</span>
								<svg
									className="size-7 translate-x-1.5 -scale-x-100 -rotate-6 text-amber-400/80 sm:size-8"
									viewBox="0 0 40 40"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.6"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M34 4c1 15-5 26-21 30" />
									<path d="m22 37-9-3 7.5-8" />
								</svg>
							</div>

							{/* Plain Floating Logo (Clickable, No Card, Crisp 512px Asset) */}
							<button
								type="button"
								onClick={() => setIsOpen(true)}
								className="group relative z-10 flex cursor-pointer items-center justify-center border-none p-3 transition-transform outline-none focus:border-none focus:ring-0 focus:outline-none active:scale-95"
								aria-label="Click to open live extension simulation"
							>
								<picture className="animate-gentle-float size-32 select-none group-hover:scale-105 sm:size-40">
									<source srcSet="/icons/512.webp" type="image/webp" />
									<img
										src="/icons/512.png"
										alt={APP_INFO.name}
										title={APP_INFO.name}
										draggable={false}
										width={160}
										height={160}
										className="size-full object-contain drop-shadow-[0_0_25px_rgba(245,158,11,0.35)] drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)] transition-all duration-300 select-none"
									/>
								</picture>
							</button>

							{/* Right Decorative Handwritten Hint: Try extension! */}
							<div
								data-slot="handwritten-hint-right"
								className="pointer-events-none absolute top-2 left-[calc(50%+76px)] z-20 flex flex-col items-start font-handwritten text-xl tracking-normal text-amber-100/90 select-none sm:top-3 sm:left-[calc(50%+96px)] sm:text-2xl"
								aria-hidden="true"
							>
								<span className="rotate-6 whitespace-nowrap">try extension!</span>
								<svg
									className="size-7 -translate-x-1.5 rotate-6 text-amber-400/80 sm:size-8"
									viewBox="0 0 40 40"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.6"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M34 4c1 15-5 26-21 30" />
									<path d="m22 37-9-3 7.5-8" />
								</svg>
							</div>
						</div>
					) : (
						/* Expanded State: Clean Authentic Extension Popup Frame */
						<div
							ref={containerRef}
							className={`${
								isClosing ? "animate-fold-up" : "animate-unfold-down"
							} relative w-full max-w-97.5 overflow-hidden rounded-2xl border border-white/12 bg-background`}
						>
							{/* Simulated Chrome Extension Window Header */}
							<div className="flex items-center justify-between border-b border-border/80 bg-neutral-900/90 px-3 py-2 text-[11px] backdrop-blur-md">
								<div className="flex items-center gap-2">
									<span className="flex size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
									<span className="font-medium text-neutral-300">Live Simulation</span>
								</div>

								<div className="flex items-center gap-1.5">
									{/* Domain Toggle Button (Simulate on one.google.com vs off-site) */}
									<button
										type="button"
										onClick={handleToggleDomain}
										title="Toggle simulated domain context"
										className="flex items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground transition-colors hover:border-border hover:text-foreground"
									>
										<Globe className="size-2.5 text-primary" />
										<span>{isOnGoogleOne ? "one.google.com" : "off-site"}</span>
									</button>

									{/* Minimize / Close Button */}
									<button
										type="button"
										onClick={handleClose}
										title="Minimize back to launcher"
										className="flex size-5 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
									>
										<X className="size-3.5" />
									</button>
								</div>
							</div>

							{/* Actual Extension Popup Root */}
							<div className="flex flex-col bg-background font-sans text-foreground antialiased selection:bg-primary/20">
								<PopupHeader
									onOpenGoogleOne={() => window.open(APP_INFO.googleOneUrl, "_blank")}
									onVersionClick={handleVersionClick}
								/>

								<PopupStatusBanner
									isMounted={isMounted}
									isOnGoogleOne={isOnGoogleOne}
									selectedLayer={selectedLayer}
									isRefreshing={isRefreshing}
									onReloadPage={handleReloadPage}
									onOpenGoogleOne={() => window.open(APP_INFO.googleOneUrl, "_blank")}
								/>

								{/* Navigation Tabs (2 columns normally, 3 when dev mode active) */}
								<div
									className={`grid ${
										isDevMode ? "grid-cols-3" : "grid-cols-2"
									} border-b border-border/60 bg-muted/20 px-3 py-1`}
								>
									{tabs.map(({ id, label, icon: Icon }) => {
										const isTabActive = currentTab === id;
										return (
											<button
												key={id}
												type="button"
												onClick={() => setActiveTab(id)}
												className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all ${
													isTabActive
														? "bg-background text-foreground shadow-xs"
														: "text-muted-foreground hover:text-foreground"
												}`}
											>
												<Icon className="size-3.5" />
												{label}
											</button>
										);
									})}
								</div>

								{/* Tab Views */}
								<div className="max-h-115 overflow-y-auto">
									{currentTab === "tiers" && (
										<TiersTab
											selectedLayer={selectedLayer}
											disabled={!isOnGoogleOne}
											onSelectLayer={handleSelectLayer}
										/>
									)}
									{currentTab === "guide" && (
										<GuideTab
											onOpenPlaySubs={() => window.open(APP_INFO.googlePlaySubsUrl, "_blank")}
										/>
									)}
									{isDevMode && currentTab === "settings" && (
										<TokensTab
											customTokens={customTokens}
											settingsSaved={settingsSaved}
											disabled={!isOnGoogleOne}
											onTokenChange={handleTokenChange}
											onSave={handleSaveCustomTokens}
											onReset={handleResetCustomTokens}
										/>
									)}
								</div>

								<PopupFooter />
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
