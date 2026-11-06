import { useState, useEffect } from "react";
import { SUBSCRIPTION_CONSTANTS, type OfferTierId } from "@/constants/offers";
import type { CustomTokensMap } from "../types";

export function useCustomTokens(
	selectedLayer: OfferTierId,
	activeTabId?: number | null,
	isOnGoogleOne = false,
) {
	const [customTokens, setCustomTokens] = useState<CustomTokensMap>({});
	const [settingsSaved, setSettingsSaved] = useState(false);

	useEffect(() => {
		if (typeof chrome === "undefined" || !chrome.storage) return;

		chrome.storage.local.get([SUBSCRIPTION_CONSTANTS.STORAGE_KEY_CUSTOM_TOKENS], (result) => {
			if (result[SUBSCRIPTION_CONSTANTS.STORAGE_KEY_CUSTOM_TOKENS]) {
				setCustomTokens(
					result[SUBSCRIPTION_CONSTANTS.STORAGE_KEY_CUSTOM_TOKENS] as CustomTokensMap,
				);
			}
		});
	}, []);

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
					if (activeTabId && isOnGoogleOne) {
						chrome.tabs.sendMessage(activeTabId, {
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
				if (activeTabId && isOnGoogleOne) {
					chrome.tabs.sendMessage(activeTabId, {
						type: "setLayer",
						layer: selectedLayer,
					});
				}
			});
		}
	};

	return {
		customTokens,
		settingsSaved,
		handleTokenChange,
		handleSaveCustomTokens,
		handleResetCustomTokens,
	};
}

