import { useState, useMemo } from "react";
import { APP_INFO } from "@/constants/app-info";
import { Layers, BookOpen, Settings2 } from "lucide-react";
import { PopupHeader } from "./components/popup-header";
import { PopupStatusBanner } from "./components/popup-status-banner";
import { TiersTab } from "./components/tiers-tab";
import { GuideTab } from "./components/guide-tab";
import { TokensTab } from "./components/tokens-tab";
import { PopupFooter } from "./components/popup-footer";
import { useTheme } from "./hooks/use-theme";
import { useDeveloperMode } from "./hooks/use-developer-mode";
import { useExtensionSync } from "./hooks/use-extension-sync";
import { useCustomTokens } from "./hooks/use-custom-tokens";

type TabSection = "tiers" | "guide" | "settings";

interface TabItem {
	id: TabSection;
	label: string;
	icon: typeof Layers;
}

export default function Popup() {
	const [activeTabSection, setActiveTabSection] = useState<TabSection>("tiers");

	useTheme();
	const { isDevMode, handleVersionClick } = useDeveloperMode();
	const {
		selectedLayer,
		activeTab,
		isOnGoogleOne,
		isMounted,
		isRefreshing,
		handleSelectLayer,
		handleReloadPage,
	} = useExtensionSync();

	const {
		customTokens,
		settingsSaved,
		handleTokenChange,
		handleSaveCustomTokens,
		handleResetCustomTokens,
	} = useCustomTokens(selectedLayer, activeTab?.id, isOnGoogleOne);

	// Effective active tab (falls back to tiers if settings tab is hidden)
	const currentTab = !isDevMode && activeTabSection === "settings" ? "tiers" : activeTabSection;

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

	return (
		<div className="flex w-95 flex-col bg-background font-sans text-foreground antialiased selection:bg-primary/20">
			<PopupHeader onOpenGoogleOne={handleOpenGoogleOne} onVersionClick={handleVersionClick} />

			<PopupStatusBanner
				isMounted={isMounted}
				isOnGoogleOne={isOnGoogleOne}
				selectedLayer={selectedLayer}
				isRefreshing={isRefreshing}
				onReloadPage={handleReloadPage}
				onOpenGoogleOne={handleOpenGoogleOne}
			/>

			{/* Navigation Tabs (2 columns normally, 3 when dev mode active) */}
			<div
				className={`grid ${
					isDevMode ? "grid-cols-3" : "grid-cols-2"
				} border-b border-border/60 bg-muted/20 px-3 py-1`}
			>
				{tabs.map(({ id, label, icon: Icon }) => {
					const isActive = currentTab === id;
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
			{currentTab === "tiers" && (
				<TiersTab
					selectedLayer={selectedLayer}
					disabled={!isOnGoogleOne}
					onSelectLayer={handleSelectLayer}
				/>
			)}
			{currentTab === "guide" && <GuideTab onOpenPlaySubs={handleOpenPlaySubs} />}
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

			<PopupFooter />
		</div>
	);
}
