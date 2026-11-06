import { SUBSCRIPTION_CONSTANTS, type OfferTierId } from "@/constants/offers";
import { getEffectiveTokens } from "./token-config";
import type {
	CustomTokensMap,
	ExtensionState,
	RuntimeMessage,
	RuntimeResponse,
	WindowBridgeMessage,
} from "./types";

/**
 * Gemini AI Pro Portal - Content Script (Isolated World)
 *
 * Runs on `https://one.google.com/*`. Acts as a secure, typesafe bridge between:
 * 1. The Chrome Extension runtime / popup / storage
 * 2. The page's MAIN execution world (`inject.ts`) via window.postMessage
 */

(() => {
	let latestState: ExtensionState = {
		layer: "off",
		mounted: false,
		subId: null,
		lastUpdated: Date.now(),
	};

	/**
	 * Dispatches configuration update to the MAIN world via window.postMessage.
	 */
	async function pushConfiguration(layer: OfferTierId) {
		const targetLayer = layer || "off";

		try {
			document.documentElement.setAttribute("data-gapt-layer", targetLayer);
		} catch {
			// Ignore DOM exceptions
		}

		const { tokens, ytPremiumToken } = await getEffectiveTokens();
		const customTokensMap: CustomTokensMap = {
			...tokens,
			ytPremium: ytPremiumToken,
		};

		window.postMessage(
			{
				__gapt: 1,
				type: "cfg",
				layer: targetLayer,
				customTokens: customTokensMap,
			} satisfies WindowBridgeMessage,
			"*",
		);
	}

	/**
	 * Reads active layer from chrome.storage.local and synchronizes it.
	 */
	function synchronizeLayerFromStorage() {
		try {
			chrome.storage.local.get([SUBSCRIPTION_CONSTANTS.STORAGE_KEY_LAYER], (result) => {
				const savedLayer = (result && result[SUBSCRIPTION_CONSTANTS.STORAGE_KEY_LAYER]) as
					| OfferTierId
					| undefined;
				// Default to '12m' introductory tier if not yet configured
				pushConfiguration(savedLayer || "12m");
			});
		} catch {
			pushConfiguration("12m");
		}
	}

	// Listen for state broadcasts from the MAIN world
	window.addEventListener("message", (event: MessageEvent<WindowBridgeMessage>) => {
		const data = event.data;
		if (data && data.__gapt === 1 && data.type === "state" && data.state) {
			latestState = data.state;
		}
	});

	// Handle runtime messages from the extension popup
	try {
		chrome.runtime.onMessage.addListener(
			(message: RuntimeMessage, _sender, sendResponse: (res: RuntimeResponse<unknown>) => void) => {
				if (!message || typeof message !== "object") return;

				if (message.type === "getState") {
					// Ping MAIN world to get fresh state
					window.postMessage({ __gapt: 1, type: "ping" } satisfies WindowBridgeMessage, "*");
					setTimeout(() => {
						sendResponse({ ok: true, data: latestState });
					}, 120);
					return true; // Keep response channel open for async callback
				}

				if (message.type === "setLayer") {
					pushConfiguration(message.layer);
					try {
						chrome.storage.local.set({ [SUBSCRIPTION_CONSTANTS.STORAGE_KEY_LAYER]: message.layer });
					} catch {
						// Ignore
					}
					setTimeout(() => {
						sendResponse({ ok: true, data: latestState });
					}, 150);
					return true;
				}
			},
		);

		// Synchronize when storage changes in another tab/popup
		chrome.storage.onChanged.addListener((changes, area) => {
			if (area === "local" && changes[SUBSCRIPTION_CONSTANTS.STORAGE_KEY_LAYER]) {
				const newLayer = changes[SUBSCRIPTION_CONSTANTS.STORAGE_KEY_LAYER].newValue as OfferTierId;
				pushConfiguration(newLayer || "off");
			}
		});
	} catch {
		// Fail-safe pass through
	}

	// Initial configuration push
	synchronizeLayerFromStorage();

	// Additional delayed sync passes to handle Google One SPA route transitions
	setTimeout(synchronizeLayerFromStorage, 800);
	setTimeout(synchronizeLayerFromStorage, 2500);
})();
