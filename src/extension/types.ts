import type { OfferTierId } from "@/constants/offers";

export interface ExtensionState {
	layer: OfferTierId;
	mounted: boolean;
	subId?: string | null;
	lastUpdated?: number;
}

export type CustomTokensMap = Partial<Record<Exclude<OfferTierId, "off">, string>> & {
	ytPremium?: string;
};

/* Bridge messages between Content Script (Isolated) and MAIN World */
export type WindowBridgeMessage =
	| {
			__gapt: 1;
			type: "cfg";
			layer: OfferTierId;
			customTokens?: CustomTokensMap;
	  }
	| {
			__gapt: 1;
			type: "ping";
	  }
	| {
			__gapt: 1;
			type: "state";
			state: ExtensionState;
	  };

/* Chrome Runtime Messages between Popup and Content Script / Background */
export type RuntimeMessage =
	| {
			type: "getState";
	  }
	| {
			type: "setLayer";
			layer: OfferTierId;
	  }
	| {
			type: "setTokens";
			customTokens: CustomTokensMap;
	  }
	| {
			type: "resetTokens";
	  };

export interface RuntimeResponse<T = unknown> {
	ok: boolean;
	data?: T;
	error?: string;
}

/* Guard detection status in Play Checkout iframe */
export type GuardSafetyLevel = "safe" | "danger" | "warning" | "scanning";

export interface GuardEvaluation {
	level: GuardSafetyLevel;
	message: string;
	details?: string;
}
