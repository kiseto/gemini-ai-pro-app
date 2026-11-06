import { useState, useEffect, useCallback } from "react";
import { SUBSCRIPTION_CONSTANTS, type OfferTierId } from "@/constants/offers";
import type { ExtensionState } from "../types";

export function useExtensionSync() {
	const [selectedLayer, setSelectedLayer] = useState<OfferTierId>("12m");
	const [extensionState, setExtensionState] = useState<ExtensionState | null>(null);
	const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);
	const [isOnGoogleOne, setIsOnGoogleOne] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);

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

	// Initialize layer and start state polling
	useEffect(() => {
		if (typeof chrome === "undefined" || !chrome.storage) return;

		chrome.storage.local.get([SUBSCRIPTION_CONSTANTS.STORAGE_KEY_LAYER], (result) => {
			const savedLayer = result[SUBSCRIPTION_CONSTANTS.STORAGE_KEY_LAYER] as
				| OfferTierId
				| undefined;
			if (savedLayer) {
				setSelectedLayer(savedLayer);
			}
		});

		queryCurrentTabAndState();
		const interval = setInterval(queryCurrentTabAndState, 2000);
		return () => clearInterval(interval);
	}, [queryCurrentTabAndState]);

	// Switch layer and synchronize with content script in active tab
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

	const isMounted = Boolean(extensionState?.mounted && selectedLayer !== "off");

	return {
		selectedLayer,
		extensionState,
		activeTab,
		isOnGoogleOne,
		isMounted,
		isRefreshing,
		handleSelectLayer,
		handleReloadPage,
	};
}

