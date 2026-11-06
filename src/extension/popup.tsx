import { useState, useEffect, useCallback } from "react";
import {
	OFFER_TIER_LIST,
	OFFER_TIERS,
	SUBSCRIPTION_CONSTANTS,
	type OfferTierId,
	DEFAULT_OFFER_TOKENS,
} from "@/constants/offers";
import { APP_INFO } from "@/constants/app-info";
import type { ExtensionState, CustomTokensMap } from "./types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	ShieldCheck,
	CheckCircle2,
	AlertTriangle,
	ExternalLink,
	RefreshCw,
	Layers,
	BookOpen,
	Settings2,
	RotateCcw,
	ChevronRight,
	Sun,
	Moon,
	Eye,
	EyeOff,
	Copy,
	Check,
	Info,
} from "lucide-react";

export default function Popup() {
	const [selectedLayer, setSelectedLayer] = useState<OfferTierId>("12m");
	const [extensionState, setExtensionState] = useState<ExtensionState | null>(null);
	const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);
	const [isOnGoogleOne, setIsOnGoogleOne] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [activeTabSection, setActiveTabSection] = useState<"tiers" | "guide" | "settings">("tiers");
	const [customTokens, setCustomTokens] = useState<CustomTokensMap>({});
	const [settingsSaved, setSettingsSaved] = useState(false);
	const [showTokens, setShowTokens] = useState(false);
	const [copiedKey, setCopiedKey] = useState<string | null>(null);
	const [isDark, setIsDark] = useState(() => {
		if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
			return true;
		}
		return false;
	});

	// Theme synchronization
	useEffect(() => {
		document.documentElement.classList.toggle("dark", isDark);
	}, [isDark]);

	useEffect(() => {
		if (typeof chrome !== "undefined" && chrome.storage) {
			chrome.storage.local.get(["gapt_theme"], (res) => {
				if (res?.gapt_theme) {
					setIsDark(res.gapt_theme === "dark");
				}
			});
		}
	}, []);

	const toggleTheme = () => {
		setIsDark((prev) => {
			const next = !prev;
			if (typeof chrome !== "undefined" && chrome.storage) {
				chrome.storage.local.set({ gapt_theme: next ? "dark" : "light" });
			}
			return next;
		});
	};

	const handleCopyToken = (key: string, value: string) => {
		navigator.clipboard.writeText(value);
		setCopiedKey(key);
		setTimeout(() => setCopiedKey(null), 1500);
	};

	const queryCurrentTabAndState = useCallback(() => {
		if (typeof chrome === "undefined" || !chrome.tabs) return;

		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const current = tabs && tabs[0];
			setActiveTab(current || null);

			const currentUrl = current?.url || "";
			const onGoogleOne = currentUrl.includes("one.google.com");
			setIsOnGoogleOne(onGoogleOne);

			if (current?.id && onGoogleOne) {
				chrome.tabs.sendMessage(current.id, { type: "getState" }, (response) => {
					if (chrome.runtime.lastError || !response || !response.ok) {
						setExtensionState(null);
						return;
					}
					setExtensionState(response.data as ExtensionState);
				});
			} else {
				setExtensionState(null);
			}
		});
	}, []);

	// Initialize configuration from local storage
	useEffect(() => {
		if (typeof chrome === "undefined" || !chrome.storage) return;

		chrome.storage.local.get(
			[SUBSCRIPTION_CONSTANTS.STORAGE_KEY_LAYER, SUBSCRIPTION_CONSTANTS.STORAGE_KEY_CUSTOM_TOKENS],
			(result) => {
				const savedLayer = result[SUBSCRIPTION_CONSTANTS.STORAGE_KEY_LAYER] as
					| OfferTierId
					| undefined;
				if (savedLayer) {
					setSelectedLayer(savedLayer);
				}
				if (result[SUBSCRIPTION_CONSTANTS.STORAGE_KEY_CUSTOM_TOKENS]) {
					setCustomTokens(
						result[SUBSCRIPTION_CONSTANTS.STORAGE_KEY_CUSTOM_TOKENS] as CustomTokensMap,
					);
				}
			},
		);

		queryCurrentTabAndState();
		const interval = setInterval(queryCurrentTabAndState, 2000);
		return () => clearInterval(interval);
	}, [queryCurrentTabAndState]);

	// Switch layer and synchronize with active tab
	const handleSelectLayer = (layer: OfferTierId) => {
		setSelectedLayer(layer);

		if (typeof chrome === "undefined") return;

		chrome.storage.local.set({ [SUBSCRIPTION_CONSTANTS.STORAGE_KEY_LAYER]: layer }, () => {
			if (activeTab?.id && isOnGoogleOne) {
				chrome.tabs.sendMessage(activeTab.id, { type: "setLayer", layer }, (response) => {
					void chrome.runtime.lastError;
					if (response && response.ok && response.data) {
						setExtensionState(response.data as ExtensionState);
					}
					setTimeout(queryCurrentTabAndState, 300);
				});
			}
		});
	};

	const handleOpenGoogleOne = () => {
		if (typeof chrome !== "undefined" && chrome.tabs) {
			chrome.tabs.create({ url: APP_INFO.googleOneUrl });
		} else {
			window.open(APP_INFO.googleOneUrl, "_blank");
		}
	};

	const handleOpenPlaySubs = () => {
		if (typeof chrome !== "undefined" && chrome.tabs) {
			chrome.tabs.create({ url: APP_INFO.googlePlaySubsUrl });
		} else {
			window.open(APP_INFO.googlePlaySubsUrl, "_blank");
		}
	};

	const handleReloadPage = () => {
		if (typeof chrome !== "undefined" && chrome.tabs && activeTab?.id) {
			setIsRefreshing(true);
			chrome.tabs.reload(activeTab.id, {}, () => {
				setTimeout(() => {
					setIsRefreshing(false);
					queryCurrentTabAndState();
				}, 1000);
			});
		}
	};

	const handleSaveCustomTokens = () => {
		if (typeof chrome !== "undefined" && chrome.storage) {
			chrome.storage.local.set(
				{ [SUBSCRIPTION_CONSTANTS.STORAGE_KEY_CUSTOM_TOKENS]: customTokens },
				() => {
					setSettingsSaved(true);
					setTimeout(() => setSettingsSaved(false), 2000);
					if (activeTab?.id && isOnGoogleOne) {
						chrome.tabs.sendMessage(activeTab.id, {
							type: "setLayer",
							layer: selectedLayer,
						});
					}
				},
			);
		}
	};

	const handleResetCustomTokens = () => {
		setCustomTokens({});
		if (typeof chrome !== "undefined" && chrome.storage) {
			chrome.storage.local.remove([SUBSCRIPTION_CONSTANTS.STORAGE_KEY_CUSTOM_TOKENS], () => {
				setSettingsSaved(true);
				setTimeout(() => setSettingsSaved(false), 2000);
				if (activeTab?.id && isOnGoogleOne) {
					chrome.tabs.sendMessage(activeTab.id, {
						type: "setLayer",
						layer: selectedLayer,
					});
				}
			});
		}
	};

	const isMounted = Boolean(extensionState?.mounted && selectedLayer !== "off");

	return (
		<div className="flex w-[380px] flex-col bg-background font-sans text-foreground antialiased selection:bg-primary/20">
			{/* Top Header */}
			<header className="flex items-center justify-between border-b border-border/60 bg-card/60 px-4 py-3 backdrop-blur-sm">
				<div className="flex items-center gap-2.5">
					<img src="/icons/32.png" alt={APP_INFO.shortName} className="size-7 object-contain" />
					<div>
						<div className="flex items-center gap-1.5">
							<h1 className="text-sm font-semibold tracking-tight">{APP_INFO.shortName}</h1>
							<Badge variant="outline" className="px-1 py-0 text-[10px] font-medium">
								v{APP_INFO.version}
							</Badge>
						</div>
						<p className="text-[11px] text-muted-foreground">Google One 2TB AI Premium</p>
					</div>
				</div>

				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon-xs"
						onClick={toggleTheme}
						title={isDark ? "Switch to light mode" : "Switch to dark mode"}
						className="active:scale-95 transition-transform"
					>
						{isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
					</Button>
					<Button
						variant="ghost"
						size="icon-xs"
						onClick={handleOpenGoogleOne}
						title="Open one.google.com/plans"
						className="active:scale-95 transition-transform"
					>
						<ExternalLink className="size-3.5" />
					</Button>
				</div>
			</header>

			{/* Status Banner */}
			<div className="p-3">
				{isMounted ? (
					<div className="flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-700 dark:text-emerald-400">
						<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
						<div className="flex-1 text-xs">
							<div className="leading-tight font-semibold">
								Active: {OFFER_TIERS[selectedLayer]?.shortName || selectedLayer}
							</div>
							<div className="mt-0.5 text-[11px] opacity-90">
								Offer token mounted. Click &ldquo;Get discount&rdquo; on the AI Pro card.
							</div>
						</div>
					</div>
				) : isOnGoogleOne ? (
					<div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-amber-800 dark:text-amber-300">
						<AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
						<div className="flex-1 text-xs">
							<div className="leading-tight font-semibold">Injection Pending Refresh</div>
							<div className="mt-0.5 text-[11px] opacity-90">
								Refresh the plans page to mount the selected offer token.
							</div>
						</div>
						<Button
							variant="outline"
							size="xs"
							onClick={handleReloadPage}
							disabled={isRefreshing}
							className="h-6 border-amber-500/40 text-[11px]"
						>
							<RefreshCw className={`size-3 ${isRefreshing ? "animate-spin" : ""}`} />
							Refresh
						</Button>
					</div>
				) : (
					<div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/40 p-2.5 text-muted-foreground">
						<AlertTriangle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
						<div className="flex-1 text-xs">
							<div className="font-medium text-foreground">Google One Plans Not Detected</div>
							<div className="mt-0.5 text-[11px]">
								Open Google One Plans to activate the offer injector.
							</div>
						</div>
						<Button
							variant="secondary"
							size="xs"
							onClick={handleOpenGoogleOne}
							className="h-6 text-[11px]"
						>
							Open Plans
						</Button>
					</div>
				)}
			</div>

			{/* Navigation Tabs */}
			<div className="grid grid-cols-3 border-b border-border/60 bg-muted/20 px-3 py-1">
				<button
					type="button"
					onClick={() => setActiveTabSection("tiers")}
					className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all ${
						activeTabSection === "tiers"
							? "bg-background text-foreground shadow-xs"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					<Layers className="size-3.5" />
					Tiers
				</button>
				<button
					type="button"
					onClick={() => setActiveTabSection("guide")}
					className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all ${
						activeTabSection === "guide"
							? "bg-background text-foreground shadow-xs"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					<BookOpen className="size-3.5" />
					Guide
				</button>
				<button
					type="button"
					onClick={() => setActiveTabSection("settings")}
					className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all ${
						activeTabSection === "settings"
							? "bg-background text-foreground shadow-xs"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					<Settings2 className="size-3.5" />
					Tokens
				</button>
			</div>

			{/* Tab 1: Offer Tiers */}
			{activeTabSection === "tiers" && (
				<div className="space-y-2 p-3">
					<div className="text-[11px] font-medium text-muted-foreground">
						Select Subscription Tier:
					</div>

					<div className="space-y-1.5">
						{OFFER_TIER_LIST.map((tier) => {
							const isSelected = selectedLayer === tier.id;
							return (
								<button
									key={tier.id}
									type="button"
									onClick={() => handleSelectLayer(tier.id)}
									className={`group flex w-full items-center justify-between rounded-lg border p-2.5 text-left transition-all ${
										isSelected
											? "border-primary bg-primary/5 shadow-xs"
											: "border-border/60 bg-card hover:border-border hover:bg-muted/30"
									}`}
								>
									<div className="flex items-center gap-2.5">
										<div
											className={`flex size-4 items-center justify-center rounded-full border transition-all ${
												isSelected
													? "border-primary bg-primary text-primary-foreground"
													: "border-muted-foreground/40 group-hover:border-muted-foreground"
											}`}
										>
											{isSelected && <div className="size-1.5 rounded-full bg-white" />}
										</div>
										<div>
											<div className="flex items-center gap-1.5">
												<span className="text-xs font-semibold text-foreground">{tier.name}</span>
												<Badge variant={tier.tagVariant} className="px-1.5 py-0 text-[10px]">
													{tier.tag}
												</Badge>
											</div>
											<p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
												{tier.description}
											</p>
										</div>
									</div>
								</button>
							);
						})}
					</div>

					<div className="mt-2 flex items-center justify-between rounded-md border border-border/40 bg-muted/20 px-2.5 py-2 text-[11px] text-muted-foreground">
						<span className="flex items-center gap-1.5">
							<ShieldCheck className="size-3.5 text-emerald-600" />
							Checkout Guard Active
						</span>
						<span className="text-[10px]">Auto $0.00 verification</span>
					</div>
				</div>
			)}

			{/* Tab 2: Step-by-Step Guide */}
			{activeTabSection === "guide" && (
				<div className="space-y-2.5 p-3 text-xs">
					<div className="rounded-lg border border-border/60 bg-card p-3">
						<h3 className="font-semibold text-foreground">Step-by-Step Instructions</h3>
						<ol className="mt-2 space-y-2 text-[11.5px] text-muted-foreground">
							<li className="flex gap-2">
								<span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
									1
								</span>
								<span>
									Open <b className="text-foreground">one.google.com/plans</b> and ensure your
									Google account region is set to the US (use a US payment method/ZIP like{" "}
									<b className="text-foreground">97201</b>).
								</span>
							</li>
							<li className="flex gap-2">
								<span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
									2
								</span>
								<span>
									Select <b className="text-foreground">Tier 1 · 12 Months</b> in the Tiers tab
									above, then refresh the Google One page.
								</span>
							</li>
							<li className="flex gap-2">
								<span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
									3
								</span>
								<span>
									Confirm the floating pill in the bottom right corner displays &ldquo;Offer
									Mounted&rdquo;.
								</span>
							</li>
							<li className="flex gap-2">
								<span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
									4
								</span>
								<span>
									Click <b className="text-foreground">Get discount</b> on the Google One AI Premium
									card.
								</span>
							</li>
							<li className="flex gap-2">
								<span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
									5
								</span>
								<span>
									Look at the top of the Google Play checkout popup: Verify the{" "}
									<b className="text-emerald-600 dark:text-emerald-400">Green Banner ($0.00)</b> is
									visible. If red, cancel immediately!
								</span>
							</li>
							<li className="flex gap-2">
								<span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
									6
								</span>
								<span>
									<b className="text-foreground">Stacking 2 Years:</b> After Tier 1 is active,
									switch to Tier 2 (6 Months SS) &rarr; refresh &rarr; repeat checkout. Then switch
									to Tier 3.
								</span>
							</li>
							<li className="flex gap-2">
								<span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
									7
								</span>
								<span>
									Visit Google Play Subscriptions to disable auto-renew so you are never charged at
									the conclusion of the promo period.
								</span>
							</li>
						</ol>
					</div>

					<Button
						variant="outline"
						size="sm"
						onClick={handleOpenPlaySubs}
						className="w-full text-xs"
					>
						Manage Play Subscriptions <ExternalLink className="ml-1.5 size-3" />
					</Button>
				</div>
			)}

			{/* Tab 3: Token Settings */}
			{activeTabSection === "settings" && (
				<div className="space-y-3 p-3 text-xs">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="font-semibold text-foreground">Promotional Tokens</h3>
							<p className="mt-0.5 text-[11px] text-muted-foreground">
								Tokens loaded from environment. Override or inspect below.
							</p>
						</div>
						<Button
							variant="ghost"
							size="icon-xs"
							onClick={() => setShowTokens((prev) => !prev)}
							title={showTokens ? "Mask tokens" : "Show tokens"}
						>
							{showTokens ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
						</Button>
					</div>

					{settingsSaved && (
						<div className="rounded-md bg-emerald-500/10 p-2 text-[11px] text-emerald-600 dark:text-emerald-400">
							✓ Configuration saved successfully
						</div>
					)}

					<div className="space-y-2">
						<div>
							<div className="flex items-center justify-between">
								<label className="text-[10px] font-semibold text-muted-foreground uppercase">
									Tier 1 (12 Months) Token
								</label>
								<button
									type="button"
									onClick={() =>
										handleCopyToken("12m", customTokens["12m"] || DEFAULT_OFFER_TOKENS["12m"])
									}
									className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
									title="Copy token"
								>
									{copiedKey === "12m" ? (
										<>
											<Check className="size-3 text-emerald-500" /> Copied
										</>
									) : (
										<>
											<Copy className="size-3" /> Copy
										</>
									)}
								</button>
							</div>
							<input
								type={showTokens ? "text" : "password"}
								value={customTokens["12m"] || DEFAULT_OFFER_TOKENS["12m"]}
								onChange={(e) =>
									setCustomTokens((prev) => ({ ...prev, "12m": e.target.value.trim() }))
								}
								className="mt-1 w-full rounded-md border border-border bg-card px-2 py-1 font-mono text-[10px] text-foreground"
							/>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label className="text-[10px] font-semibold text-muted-foreground uppercase">
									Tier 2 (6 Months SS) Token
								</label>
								<button
									type="button"
									onClick={() =>
										handleCopyToken("6m_ss", customTokens["6m_ss"] || DEFAULT_OFFER_TOKENS["6m_ss"])
									}
									className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
									title="Copy token"
								>
									{copiedKey === "6m_ss" ? (
										<>
											<Check className="size-3 text-emerald-500" /> Copied
										</>
									) : (
										<>
											<Copy className="size-3" /> Copy
										</>
									)}
								</button>
							</div>
							<input
								type={showTokens ? "text" : "password"}
								value={customTokens["6m_ss"] || DEFAULT_OFFER_TOKENS["6m_ss"]}
								onChange={(e) =>
									setCustomTokens((prev) => ({ ...prev, "6m_ss": e.target.value.trim() }))
								}
								className="mt-1 w-full rounded-md border border-border bg-card px-2 py-1 font-mono text-[10px] text-foreground"
							/>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label className="text-[10px] font-semibold text-muted-foreground uppercase">
									Tier 3 (6 Months) Token
								</label>
								<button
									type="button"
									onClick={() =>
										handleCopyToken("6m", customTokens["6m"] || DEFAULT_OFFER_TOKENS["6m"])
									}
									className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
									title="Copy token"
								>
									{copiedKey === "6m" ? (
										<>
											<Check className="size-3 text-emerald-500" /> Copied
										</>
									) : (
										<>
											<Copy className="size-3" /> Copy
										</>
									)}
								</button>
							</div>
							<input
								type={showTokens ? "text" : "password"}
								value={customTokens["6m"] || DEFAULT_OFFER_TOKENS["6m"]}
								onChange={(e) =>
									setCustomTokens((prev) => ({ ...prev, "6m": e.target.value.trim() }))
								}
								className="mt-1 w-full rounded-md border border-border bg-card px-2 py-1 font-mono text-[10px] text-foreground"
							/>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label className="text-[10px] font-semibold text-muted-foreground uppercase">
									Tier 4 (6 Months Alt) Token
								</label>
								<button
									type="button"
									onClick={() =>
										handleCopyToken("6m_2", customTokens["6m_2"] || DEFAULT_OFFER_TOKENS["6m_2"])
									}
									className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
									title="Copy token"
								>
									{copiedKey === "6m_2" ? (
										<>
											<Check className="size-3 text-emerald-500" /> Copied
										</>
									) : (
										<>
											<Copy className="size-3" /> Copy
										</>
									)}
								</button>
							</div>
							<input
								type={showTokens ? "text" : "password"}
								value={customTokens["6m_2"] || DEFAULT_OFFER_TOKENS["6m_2"]}
								onChange={(e) =>
									setCustomTokens((prev) => ({ ...prev, "6m_2": e.target.value.trim() }))
								}
								className="mt-1 w-full rounded-md border border-border bg-card px-2 py-1 font-mono text-[10px] text-foreground"
							/>
						</div>
					</div>

					<div className="flex items-start gap-1.5 rounded-md bg-muted/40 p-2 text-[11px] text-muted-foreground">
						<Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
						<span>Tokens are securely used by the MAIN-world injector during checkout.</span>
					</div>

					<div className="flex gap-2 pt-1">
						<Button size="xs" onClick={handleSaveCustomTokens} className="flex-1 text-xs">
							Save Overrides
						</Button>
						<Button
							variant="outline"
							size="xs"
							onClick={handleResetCustomTokens}
							className="text-xs"
							title="Reset to environment defaults"
						>
							<RotateCcw className="mr-1 size-3" />
							Reset
						</Button>
					</div>
				</div>
			)}

			{/* Footer */}
			<footer className="flex items-center justify-between border-t border-border/60 bg-muted/30 px-4 py-2.5 text-[10.5px] text-muted-foreground">
				<span>Client-side only · Zero telemetry</span>
				<a
					href={APP_INFO.githubUrl}
					target="_blank"
					rel="noreferrer"
					className="flex items-center gap-1 hover:text-foreground"
				>
					Docs &amp; Source <ChevronRight className="size-3" />
				</a>
			</footer>
		</div>
	);
}
