import {
	DEFAULT_OFFER_TOKENS,
	DEFAULT_YT_PREMIUM_TOKEN,
	type OfferTierId,
	SUBSCRIPTION_CONSTANTS,
} from "@/constants/offers";
import type { CustomTokensMap } from "./types";

/**
 * Retrieves the effective promotional tokens by merging default environment tokens
 * with any user-configured overrides stored in browser local storage.
 */
export async function getEffectiveTokens(): Promise<{
	tokens: Record<Exclude<OfferTierId, "off">, string>;
	ytPremiumToken: string;
}> {
	try {
		if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
			const result = await chrome.storage.local.get([
				SUBSCRIPTION_CONSTANTS.STORAGE_KEY_CUSTOM_TOKENS,
				SUBSCRIPTION_CONSTANTS.STORAGE_KEY_CUSTOM_YT,
			]);

			const customTokens: CustomTokensMap =
				result[SUBSCRIPTION_CONSTANTS.STORAGE_KEY_CUSTOM_TOKENS] || {};
			const customYtToken: string | undefined = result[
				SUBSCRIPTION_CONSTANTS.STORAGE_KEY_CUSTOM_YT
			] as string | undefined;

			return {
				tokens: {
					"12m": customTokens["12m"] || DEFAULT_OFFER_TOKENS["12m"],
					"6m_ss": customTokens["6m_ss"] || DEFAULT_OFFER_TOKENS["6m_ss"],
					"6m": customTokens["6m"] || DEFAULT_OFFER_TOKENS["6m"],
					"6m_2": customTokens["6m_2"] || DEFAULT_OFFER_TOKENS["6m_2"],
				},
				ytPremiumToken: customYtToken || DEFAULT_YT_PREMIUM_TOKEN,
			};
		}
	} catch {
		// Fallback to defaults if chrome.storage is unavailable
	}

	return {
		tokens: { ...DEFAULT_OFFER_TOKENS },
		ytPremiumToken: DEFAULT_YT_PREMIUM_TOKEN,
	};
}
