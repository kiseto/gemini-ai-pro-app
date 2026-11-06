import {
	DEFAULT_OFFER_TOKENS,
	DEFAULT_YT_PREMIUM_TOKEN,
	type OfferTierId,
	SUBSCRIPTION_CONSTANTS,
} from "@/constants/offers";
import type { CustomTokensMap, ExtensionState, WindowBridgeMessage } from "./types";

/**
 * Google AI Pro Portal - Main Execution World Script
 *
 * Runs directly in the MAIN page execution context of one.google.com.
 * Intercepts Google One subscription checkout requests and replaces offer tokens
 * with specified promo tokens for Google One 2TB AI Premium tier.
 */

declare global {
	interface Window {
		__GAPT_HOOKED?: boolean;
		__GAPT_READY?: boolean;
		__GAPT_STATE?: ExtensionState;
		TrustedTypePolicy?: {
			prototype: {
				createScriptURL: (input: string, ...args: unknown[]) => string;
			};
		};
	}
	type TrustedScriptURL = unknown;
}

(() => {
	if (typeof window === "undefined" || window.__GAPT_HOOKED) return;
	window.__GAPT_HOOKED = true;

	const { PREFIX, PLAN_AI_PREMIUM, PLAN_YT_PREMIUM } = SUBSCRIPTION_CONSTANTS;

	let currentTokens: Record<Exclude<OfferTierId, "off">, string> = { ...DEFAULT_OFFER_TOKENS };
	let currentYtToken: string = DEFAULT_YT_PREMIUM_TOKEN;

	interface ActiveOfferConfig {
		layer: OfferTierId;
		name: string;
		full_items: unknown[];
		ear8: unknown[] | null;
	}

	let activeConfig: ActiveOfferConfig | null = null;
	let capturedSubscriptionId: string | null = null;

	/**
	 * Constructs the Google One protobuf-like item payload for the given promotional tier.
	 */
	function buildTierConfig(layer: OfferTierId): ActiveOfferConfig | null {
		if (!layer || layer === "off" || !currentTokens[layer]) return null;

		const offerToken = currentTokens[layer];
		return {
			layer,
			name: `gapt_${layer}`,
			full_items: [
				[[PREFIX + PLAN_AI_PREMIUM, 21], null, null, null, 1, [offerToken]],
				[[PREFIX + PLAN_YT_PREMIUM, 21], null, null, null, 1, [currentYtToken]],
			],
			ear8: null,
		};
	}

	/* ==========================================================================
	 * Floating Status Badge in Google One Page
	 * ========================================================================== */
	let statusBadgeElement: HTMLDivElement | null = null;
	let isBadgeMinimized = false;

	function createOrUpdateBadge(text: string, isMounted: boolean) {
		try {
			if (!document.body) return;

			if (!statusBadgeElement) {
				statusBadgeElement = document.createElement("div");
				statusBadgeElement.id = "gapt-floating-badge";
				statusBadgeElement.style.cssText = `
					position: fixed;
					right: 18px;
					bottom: 18px;
					z-index: 2147483647;
					display: flex;
					align-items: center;
					gap: 8px;
					padding: 9px 14px;
					border-radius: 9999px;
					font: 12px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
					background: rgba(255, 255, 255, 0.92);
					backdrop-filter: blur(12px);
					-webkit-backdrop-filter: blur(12px);
					color: #1f2937;
					box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.06);
					border: 1px solid rgba(0, 0, 0, 0.08);
					transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
					user-select: none;
					cursor: pointer;
				`;

				statusBadgeElement.addEventListener("click", () => {
					isBadgeMinimized = !isBadgeMinimized;
					updateBadgeContent();
				});

				document.body.appendChild(statusBadgeElement);
			}

			updateBadgeContent();
		} catch {
			// Fail gracefully if DOM is restricted
		}

		function updateBadgeContent() {
			if (!statusBadgeElement) return;

			if (isBadgeMinimized) {
				statusBadgeElement.innerHTML = `
					<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${isMounted ? "#10b981" : "#9ca3af"};"></span>
					<span style="font-weight:600;font-size:11px;">AI Pro</span>
				`;
				statusBadgeElement.title = text + " (Click to expand)";
				return;
			}

			const indicatorColor = isMounted ? "#10b981" : "#9ca3af";
			const pulseAnim = isMounted
				? "animation: gapt-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"
				: "";

			statusBadgeElement.innerHTML = `
				<style>
					@keyframes gapt-pulse {
						0%, 100% { opacity: 1; transform: scale(1); }
						50% { opacity: 0.6; transform: scale(1.1); }
					}
					@media (prefers-color-scheme: dark) {
						#gapt-floating-badge {
							background: rgba(24, 24, 27, 0.92) !important;
							color: #f4f4f5 !important;
							border-color: rgba(255, 255, 255, 0.12) !important;
							box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.35) !important;
						}
					}
				</style>
				<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${indicatorColor};${pulseAnim}"></span>
				<span style="font-weight:600;letter-spacing:-0.2px;">${text}</span>
				<span style="opacity:0.4;font-size:10px;margin-left:2px;">✕</span>
			`;
			statusBadgeElement.title = "Click to minimize";
		}
	}

	function refreshStatusBadge() {
		if (!activeConfig) {
			createOrUpdateBadge("AI Pro Injector: Disabled", false);
		} else {
			const tierLabels: Record<OfferTierId, string> = {
				off: "Disabled",
				"12m": "Tier 1 (12 Months)",
				"6m_ss": "Tier 2 (6M Stacking)",
				"6m": "Tier 3 (6M Stacking)",
				"6m_2": "Tier 4 (6M Backup)",
			};
			const label = tierLabels[activeConfig.layer] || activeConfig.layer;
			const stackingNote = capturedSubscriptionId ? " · Stacking Active" : "";
			createOrUpdateBadge(`AI Pro Offer Mounted: ${label}${stackingNote}`, true);
		}
	}

	/* ==========================================================================
	 * Checkout Request Interception & Modification
	 * ========================================================================== */

	function patchPayloadNode(node: unknown[]): boolean {
		if (!Array.isArray(node) || !activeConfig || !Array.isArray(activeConfig.full_items)) {
			return false;
		}

		let wasPatched = false;

		// Standard Play acquire payload branch
		if (node.length > 12 && Array.isArray(node[12])) {
			if (
				Array.isArray(node[7]) &&
				Array.isArray(node[7][5]) &&
				(node[7][5] as unknown[]).length > 0
			) {
				capturedSubscriptionId = String((node[7][5] as unknown[])[0]);
			}

			node[12] = activeConfig.full_items;
			const mode = (activeConfig.ear8 && (activeConfig.ear8[1] as number)) || 5;

			if (activeConfig.ear8) {
				node[7] = activeConfig.ear8;
			} else if (
				Array.isArray(node[7]) &&
				Array.isArray(node[7][5]) &&
				(node[7][5] as unknown[]).length > 0
			) {
				node[7][1] = mode;
			} else if (capturedSubscriptionId) {
				node[7] = [null, mode, null, null, null, [capturedSubscriptionId]];
			}
			wasPatched = true;
		}

		// Alternate batch format branch
		if (node.length > 10 && Array.isArray(node[10]) && Array.isArray(node[10][0])) {
			node[10] = [activeConfig.full_items];
			if (Array.isArray(node[2]) && Array.isArray(node[2][2]) && Array.isArray(node[2][2][8])) {
				node[2][2][8] = [activeConfig.full_items];
			}
			if (activeConfig.ear8) {
				node[6] = activeConfig.ear8;
			}
			wasPatched = true;
		}

		return wasPatched;
	}

	function rewriteFreqBody(bodyString: string): string {
		if (typeof bodyString !== "string" || !bodyString.includes("f.req=") || !activeConfig) {
			return bodyString;
		}

		try {
			const parts = bodyString.split("&");
			for (let i = 0; i < parts.length; i++) {
				if (parts[i].startsWith("f.req=")) {
					const rawPayload = decodeURIComponent(parts[i].slice(6).replace(/\+/g, " "));
					const outerStructure = JSON.parse(rawPayload);
					let wasModified = false;

					if (Array.isArray(outerStructure)) {
						for (const group of outerStructure) {
							if (!Array.isArray(group)) continue;
							for (const rpcCall of group) {
								if (
									Array.isArray(rpcCall) &&
									rpcCall[0] === "Ngbm" &&
									typeof rpcCall[1] === "string"
								) {
									const innerPayload = JSON.parse(rpcCall[1]);
									if (Array.isArray(innerPayload)) {
										if (patchPayloadNode(innerPayload[0])) wasModified = true;
										if (patchPayloadNode(innerPayload[1])) wasModified = true;
									}
									if (wasModified) {
										rpcCall[1] = JSON.stringify(innerPayload);
									}
								}
							}
						}
					}

					if (wasModified) {
						parts[i] = "f.req=" + encodeURIComponent(JSON.stringify(outerStructure));
						return parts.join("&");
					}
				}
			}
		} catch {
			// Return original body if JSON parsing encounters schema differences
		}

		return bodyString;
	}

	// Monkey-patch XMLHttpRequest.prototype.send
	const originalXhrSend = XMLHttpRequest.prototype.send;
	XMLHttpRequest.prototype.send = function (body) {
		try {
			if (typeof body === "string" && body.includes("Ngbm")) {
				body = rewriteFreqBody(body);
			}
		} catch {
			// Fail-safe pass through
		}
		return originalXhrSend.call(this, body);
	};

	// Monkey-patch window.fetch for fetch-based Google One endpoints
	if (typeof window.fetch === "function") {
		const originalFetch = window.fetch;
		window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
			try {
				if (init && typeof init.body === "string" && init.body.includes("Ngbm")) {
					init = {
						...init,
						body: rewriteFreqBody(init.body),
					};
				}
			} catch {
				// Fail-safe pass through
			}
			return originalFetch.call(this, input, init);
		};
	}

	/**
	 * Intercepts and rewrites Google Play checkout iframe URLs containing `/eacquire/multiline`.
	 */
	function rewriteCheckoutUrl(rawUrl: string | TrustedScriptURL): string | TrustedScriptURL {
		const urlString = String(rawUrl || "");
		if (!urlString.includes("/eacquire/multiline") || !activeConfig) return rawUrl;

		try {
			const parsedUrl = new URL(urlString, window.location.origin);
			const earParam = parsedUrl.searchParams.get("ear");
			if (!earParam) return rawUrl;

			const earData = JSON.parse(earParam);
			if (Array.isArray(earData[8]) && Array.isArray(earData[8][5]) && earData[8][5].length > 0) {
				capturedSubscriptionId = String(earData[8][5][0]);
			}

			if (Array.isArray(earData[13]) && Array.isArray(activeConfig.full_items)) {
				earData[13][0] = activeConfig.full_items;
			}

			if (
				Array.isArray(earData[4]) &&
				typeof earData[4][0] === "string" &&
				Array.isArray(activeConfig.full_items)
			) {
				try {
					const innerEncoded = JSON.parse(atob(earData[4][0]));
					if (Array.isArray(innerEncoded) && innerEncoded.length > 8) {
						innerEncoded[8] = [activeConfig.full_items];
						earData[4][0] = btoa(JSON.stringify(innerEncoded));
					}
				} catch {
					// Ignore decoding error
				}
			}

			const mode = (activeConfig.ear8 && (activeConfig.ear8[1] as number)) || 5;
			if (activeConfig.ear8) {
				earData[8] = activeConfig.ear8;
			} else if (
				Array.isArray(earData[8]) &&
				Array.isArray(earData[8][5]) &&
				earData[8][5].length > 0
			) {
				earData[8][1] = mode;
			} else if (capturedSubscriptionId) {
				earData[8] = [null, mode, null, null, null, [capturedSubscriptionId]];
			}

			earData[24] = null;
			parsedUrl.searchParams.set("ear", JSON.stringify(earData));
			return parsedUrl.toString();
		} catch {
			return rawUrl;
		}
	}

	// Intercept Trusted Types policy if active
	if (
		typeof window.TrustedTypePolicy !== "undefined" &&
		window.TrustedTypePolicy.prototype.createScriptURL
	) {
		const originalCreateScriptURL = window.TrustedTypePolicy.prototype.createScriptURL;
		window.TrustedTypePolicy.prototype.createScriptURL = function (
			input: string,
			...args: unknown[]
		) {
			const rewritten = rewriteCheckoutUrl(input);
			return originalCreateScriptURL.call(
				this,
				typeof rewritten === "string" ? rewritten : input,
				...args,
			);
		};
	}

	// Intercept HTMLIFrameElement.prototype.src
	const iframeSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "src");
	if (iframeSrcDescriptor && iframeSrcDescriptor.set) {
		Object.defineProperty(HTMLIFrameElement.prototype, "src", {
			...iframeSrcDescriptor,
			set(newSrc: string) {
				const rewritten = typeof newSrc === "string" ? rewriteCheckoutUrl(newSrc) : newSrc;
				iframeSrcDescriptor.set!.call(this, typeof rewritten === "string" ? rewritten : newSrc);
			},
		});
	}

	// Intercept Element.prototype.setAttribute for iframe src
	const originalSetAttribute = Element.prototype.setAttribute;
	Element.prototype.setAttribute = function (name: string, value: string) {
		let finalValue = value;
		if (this instanceof HTMLIFrameElement && String(name).toLowerCase() === "src") {
			const rewritten = rewriteCheckoutUrl(String(value));
			if (typeof rewritten === "string") finalValue = rewritten;
		}
		return originalSetAttribute.call(this, name, finalValue);
	};

	/* ==========================================================================
	 * Configuration Synchronization & Window Bridge
	 * ========================================================================== */

	function applyTierConfiguration(layer: OfferTierId, customTokens?: CustomTokensMap) {
		if (customTokens) {
			if (customTokens["12m"]) currentTokens["12m"] = customTokens["12m"];
			if (customTokens["6m_ss"]) currentTokens["6m_ss"] = customTokens["6m_ss"];
			if (customTokens["6m"]) currentTokens["6m"] = customTokens["6m"];
			if (customTokens["6m_2"]) currentTokens["6m_2"] = customTokens["6m_2"];
			if (customTokens.ytPremium) currentYtToken = customTokens.ytPremium;
		}

		activeConfig = buildTierConfig(layer);
		window.__GAPT_READY = true;
		window.__GAPT_STATE = {
			layer: layer || "off",
			mounted: Boolean(activeConfig),
			subId: capturedSubscriptionId,
			lastUpdated: Date.now(),
		};

		refreshStatusBadge();

		try {
			window.postMessage(
				{
					__gapt: 1,
					type: "state",
					state: window.__GAPT_STATE,
				} satisfies WindowBridgeMessage,
				"*",
			);
		} catch {
			// Fail-safe ignore
		}
	}

	// Listen for configuration and ping messages from the content script
	window.addEventListener("message", (event: MessageEvent<WindowBridgeMessage>) => {
		const data = event.data;
		if (!data || data.__gapt !== 1) return;

		if (data.type === "cfg") {
			applyTierConfiguration(data.layer, data.customTokens);
		} else if (data.type === "ping") {
			try {
				window.postMessage(
					{
						__gapt: 1,
						type: "state",
						state: window.__GAPT_STATE || {
							layer: "off",
							mounted: false,
							subId: null,
							lastUpdated: Date.now(),
						},
					} satisfies WindowBridgeMessage,
					"*",
				);
			} catch {
				// Ignore
			}
		}
	});
})();
