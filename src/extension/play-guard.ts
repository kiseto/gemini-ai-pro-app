import type { GuardEvaluation, GuardSafetyLevel } from "./types";

/**
 * Gemini AI Pro Portal - Google Play Checkout Safety Guard
 *
 * Runs inside Google Play checkout iframes (`tokenized.play.google.com`).
 * Inspects real-time checkout terms before the user confirms a subscription.
 * Renders an alert banner confirming whether the checkout is genuinely $0.00 trial
 * or if an unexpected charge would occur.
 */

declare global {
	interface Window {
		__GAPT_GUARD_ACTIVE?: boolean;
	}
}

(() => {
	// Guard only runs within nested checkout iframes, not top-level windows
	if (typeof window === "undefined" || window.__GAPT_GUARD_ACTIVE || window.top === window) {
		return;
	}
	window.__GAPT_GUARD_ACTIVE = true;

	const FREE_TRIAL_PATTERNS = [
		"free trial",
		"start your free trial",
		"start free trial",
		"trial period",
		"us$0.00",
		"$0.00",
		"0.00 usd",
		"0,00 €",
		"€0.00",
		"£0.00",
		"c$0.00",
		"a$0.00",
		"0.00 cad",
		"0.00 aud",
		"¥0",
		"won't be charged",
		"won't be charged until",
		"no charge today",
		"first 12 months free",
		"first 6 months free",
		"first year free",
		"free for 1 year",
		"free for 12 months",
		"free for 6 months",
		"zero charge today",
		"免费试用",
		"不会向您收费",
		"不会收费",
	];

	const IMMEDIATE_CHARGE_PATTERNS = [
		"/mo after",
		"/month after",
		"per month after",
		"/yr after",
		"/year after",
		"pay now",
		"charged today",
		"due today",
		"total due today",
		"billed today",
		"today's charge",
		"charged now",
		"amount due today",
		"立即付款",
		"今日扣款",
	];

	let guardBannerElement: HTMLDivElement | null = null;

	function createBanner(evalResult: GuardEvaluation) {
		if (!document.body) return;

		if (!guardBannerElement) {
			guardBannerElement = document.createElement("div");
			guardBannerElement.id = "gapt-checkout-safety-guard";
			guardBannerElement.style.cssText = `
				position: fixed;
				left: 12px;
				right: 12px;
				top: 12px;
				z-index: 2147483647;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10px 16px;
				border-radius: 12px;
				font: 13px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
				font-weight: 500;
				box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
				transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
				transform: translateY(0);
				opacity: 1;
			`;

			document.body.appendChild(guardBannerElement);
		}

		const colorSchemes: Record<
			GuardSafetyLevel,
			{ bg: string; text: string; border: string; icon: string }
		> = {
			safe: {
				bg: "#065f46",
				text: "#ecfdf5",
				border: "#059669",
				icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`,
			},
			danger: {
				bg: "#991b1b",
				text: "#fef2f2",
				border: "#dc2626",
				icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
			},
			warning: {
				bg: "#854d0e",
				text: "#fefce8",
				border: "#ca8a04",
				icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
			},
			scanning: {
				bg: "#374151",
				text: "#f3f4f6",
				border: "#4b5563",
				icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>`,
			},
		};

		const theme = colorSchemes[evalResult.level];
		guardBannerElement.style.background = theme.bg;
		guardBannerElement.style.color = theme.text;
		guardBannerElement.style.border = `1px solid ${theme.border}`;

		guardBannerElement.innerHTML = `
			<div style="display: flex; align-items: center; gap: 10px;">
				<div style="flex-shrink: 0; display: flex; align-items: center;">${theme.icon}</div>
				<div>
					<div style="font-weight: 700; font-size: 13px;">${evalResult.message}</div>
					${evalResult.details ? `<div style="font-size: 11px; opacity: 0.9; margin-top: 1px;">${evalResult.details}</div>` : ""}
				</div>
			</div>
			<button id="gapt-guard-dismiss" style="
				background: transparent;
				border: none;
				color: ${theme.text};
				opacity: 0.7;
				cursor: pointer;
				padding: 4px;
				font-size: 14px;
				margin-left: 12px;
				line-height: 1;
			" title="Dismiss banner">✕</button>
		`;

		const dismissBtn = guardBannerElement.querySelector("#gapt-guard-dismiss");
		if (dismissBtn) {
			dismissBtn.addEventListener("click", () => {
				if (guardBannerElement) {
					guardBannerElement.style.opacity = "0";
					guardBannerElement.style.transform = "translateY(-10px)";
					setTimeout(() => guardBannerElement?.remove(), 300);
				}
			});
		}
	}

	function evaluateCheckoutTerms(): GuardEvaluation {
		let bodyText = "";
		try {
			bodyText = (
				document.body && document.body.innerText ? document.body.innerText : ""
			).toLowerCase();
		} catch {
			return {
				level: "warning",
				message: "Unable to inspect frame",
				details: "Please manually confirm the total says $0.00 before subscribing.",
			};
		}

		if (!bodyText || bodyText.length < 10) {
			return {
				level: "scanning",
				message: "Scanning Google Play checkout terms...",
				details: "Checking for verified trial pricing.",
			};
		}

		const hasFreeIndicator = FREE_TRIAL_PATTERNS.some((pattern) =>
			bodyText.includes(pattern.toLowerCase()),
		);
		const hasPaidIndicator = IMMEDIATE_CHARGE_PATTERNS.some((pattern) =>
			bodyText.includes(pattern.toLowerCase()),
		);

		if (hasFreeIndicator && !hasPaidIndicator) {
			return {
				level: "safe",
				message: "Verified: $0.00 Free Trial Detected",
				details: "Safe to subscribe. Always double-check that the total displays $0.00 due today.",
			};
		}

		if (hasPaidIndicator && !hasFreeIndicator) {
			return {
				level: "danger",
				message: "Warning: Immediate Charge Detected!",
				details:
					"Do not subscribe! An immediate charge was detected. Switch tier or verify account region.",
			};
		}

		if (hasFreeIndicator && hasPaidIndicator) {
			return {
				level: "warning",
				message: "Notice: Mixed Pricing Terms Found",
				details:
					"Both free and paid phrases appear in the terms. Verify $0.00 total before clicking Subscribe.",
			};
		}

		return {
			level: "scanning",
			message: "Pricing terms not yet identified",
			details: "Checkout content may still be loading.",
		};
	}

	function runInspection() {
		const result = evaluateCheckoutTerms();
		createBanner(result);
	}

	// Schedule inspection passes
	setTimeout(runInspection, 1000);
	setTimeout(runInspection, 2500);
	setTimeout(runInspection, 5000);

	try {
		const observer = new MutationObserver(() => runInspection());
		document.addEventListener("DOMContentLoaded", () => {
			if (document.body) {
				observer.observe(document.body, {
					childList: true,
					subtree: true,
					characterData: true,
				});
			}
		});
	} catch {
		// Observer fallback
	}
})();
