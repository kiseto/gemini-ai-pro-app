import { useState, useEffect, useCallback } from "react";
import { SUBSCRIPTION_CONSTANTS, type OfferTierId } from "@/constants/offers";
import { APP_INFO } from "@/constants/app-info";
import type { ExtensionState, CustomTokensMap } from "./types";
import { Layers, BookOpen, Settings2 } from "lucide-react";
import { PopupHeader } from "./components/popup-header";
import { PopupStatusBanner } from "./components/popup-status-banner";
import { TiersTab } from "./components/tiers-tab";
import { GuideTab } from "./components/guide-tab";
import { TokensTab } from "./components/tokens-tab";
import { PopupFooter } from "./components/popup-footer";

type TabSection = "tiers" | "guide" | "settings";

interface TabItem {
	id: TabSection;
	label: string;
	icon: typeof Layers;
}

const TABS: TabItem[] = [
	{ id: "tiers", label: "Tiers", icon: Layers },
	{ id: "guide", label: "Guide", icon: BookOpen },
	{ id: "settings", label: "Tokens", icon: Settings2 },
];

export default function Popup() {
	const [selectedLayer, setSelectedLayer] = useState<OfferTierId>("12m");
	const [extensionState, setExtensionState] = useState<ExtensionState | null>(null);
	const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);
	const [isOnGoogleOne, setIsOnGoogleOne] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [activeTabSection, setActiveTabSection] = useState<TabSection>("tiers");
	const [customTokens, setCustomTokens] = useState<CustomTokensMap>({});
	const [settingsSaved, setSettingsSaved] = useState(false);
	const [isDark, setIsDark] = useState(() => {
		if (
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
		) {
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

	const handleTokenChange = (key: Exclude<OfferTierId, "off">, value: string) => {
		setCustomTokens((prev) => ({ ...prev, [key]: value }));
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
		<div className="flex w-95 flex-col bg-background font-sans text-foreground antialiased selection:bg-primary/20">
			<PopupHeader
				isDark={isDark}
				onToggleTheme={toggleTheme}
				onOpenGoogleOne={handleOpenGoogleOne}
			/>

			<PopupStatusBanner
				isMounted={isMounted}
				isOnGoogleOne={isOnGoogleOne}
				selectedLayer={selectedLayer}
				isRefreshing={isRefreshing}
				onReloadPage={handleReloadPage}
				onOpenGoogleOne={handleOpenGoogleOne}
			/>

			{/* Navigation Tabs */}
			<div className="grid grid-cols-3 border-b border-border/60 bg-muted/20 px-3 py-1">
				{TABS.map(({ id, label, icon: Icon }) => {
					const isActive = activeTabSection === id;
					return (
						<button
							key={id}
							type="button"
							onClick={() => setActiveTabSection(id)}
							className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all ${
								isActive
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
			{activeTabSection === "tiers" && (
				<TiersTab
					selectedLayer={selectedLayer}
					disabled={!isOnGoogleOne}
					onSelectLayer={handleSelectLayer}
				/>
			)}
			{activeTabSection === "guide" && <GuideTab onOpenPlaySubs={handleOpenPlaySubs} />}
			{activeTabSection === "settings" && (
				<TokensTab
					customTokens={customTokens}
					settingsSaved={settingsSaved}
					disabled={!isOnGoogleOne}
					onTokenChange={handleTokenChange}
					onSave={handleSaveCustomTokens}
					onReset={handleResetCustomTokens}
				/>
			)}

			<PopupFooter />
		</div>
	);
}
