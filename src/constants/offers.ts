export type OfferTierId = "off" | "12m" | "6m_ss" | "6m" | "6m_2";

export interface OfferTierConfig {
	id: OfferTierId;
	name: string;
	shortName: string;
	months: number;
	tag: string;
	tagVariant: "default" | "secondary" | "outline" | "destructive";
	description: string;
	stackingOrder?: number;
	isRecommended?: boolean;
}

export const OFFER_TIERS: Record<OfferTierId, OfferTierConfig> = {
	off: {
		id: "off",
		name: "Bypass / Disabled",
		shortName: "Disabled",
		months: 0,
		tag: "Inactive",
		tagVariant: "outline",
		description: "Standard Google One checkout without promotional modifications.",
	},
	"12m": {
		id: "12m",
		name: "Tier 1 · 12 Months",
		shortName: "12 Months",
		months: 12,
		tag: "Base Offer",
		tagVariant: "default",
		description: "Initial 12-month promotional offer for new or returning subscribers.",
		stackingOrder: 1,
		isRecommended: true,
	},
	"6m_ss": {
		id: "6m_ss",
		name: "Tier 2 · 6 Months (Stack 1)",
		shortName: "6M Stack 1",
		months: 6,
		tag: "Stacking A",
		tagVariant: "secondary",
		description: "First extension layer to stack an extra 6 months onto an existing subscription.",
		stackingOrder: 2,
	},
	"6m": {
		id: "6m",
		name: "Tier 3 · 6 Months (Stack 2)",
		shortName: "6M Stack 2",
		months: 6,
		tag: "Stacking B",
		tagVariant: "secondary",
		description:
			"Secondary extension layer to stack an additional 6 months (reaching 24 months total).",
		stackingOrder: 3,
	},
	"6m_2": {
		id: "6m_2",
		name: "Tier 4 · 6 Months (Backup)",
		shortName: "6 Months Alt",
		months: 6,
		tag: "Alternate",
		tagVariant: "outline",
		description: "Alternate fallback token if Tier 2 or Tier 3 encounters an eligibility error.",
	},
};

export const OFFER_TIER_LIST: OfferTierConfig[] = [
	OFFER_TIERS["12m"],
	OFFER_TIERS["6m_ss"],
	OFFER_TIERS["6m"],
	OFFER_TIERS["6m_2"],
	OFFER_TIERS["off"],
];

const getEnv = (key: string, fallback: string): string => {
	if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
		return import.meta.env[key] as string;
	}
	if (typeof process !== "undefined" && process.env && process.env[key]) {
		return process.env[key] as string;
	}
	return fallback;
};

/**
 * Default promotional offer tokens sourced strictly from environment variables.
 * Fallbacks are empty strings to prevent leaking private tokens in source control.
 */
export const DEFAULT_OFFER_TOKENS: Record<Exclude<OfferTierId, "off">, string> = {
	"12m": getEnv("VITE_OFFER_TOKEN_12M", ""),
	"6m_ss": getEnv("VITE_OFFER_TOKEN_6M_SS", ""),
	"6m": getEnv("VITE_OFFER_TOKEN_6M", ""),
	"6m_2": getEnv("VITE_OFFER_TOKEN_6M_2", ""),
};

export const DEFAULT_YT_PREMIUM_TOKEN: string = getEnv("VITE_OFFER_TOKEN_YT_PREMIUM", "");

export const SUBSCRIPTION_CONSTANTS = {
	PREFIX: "subs:com.google.android.apps.subscriptions.red:",
	PLAN_AI_PREMIUM: "g1.2tb.ai.subs_variant",
	PLAN_YT_PREMIUM: "g1.youtube_premium_individual_add_on",
	STORAGE_KEY_LAYER: "gapt_layer",
	STORAGE_KEY_CUSTOM_TOKENS: "gapt_custom_tokens",
	STORAGE_KEY_CUSTOM_YT: "gapt_custom_yt_token",
} as const;
