import type { GuardEvaluation, GuardSafetyLevel } from "./types";

/**
 * Google AI Pro Portal - Google Play Checkout Safety Guard
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
	] as const;

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
	] as const;

	let guardBannerElement: HTMLDivElement | null = null;

	/* ==========================================================================
	 * TrustedTypes & CSP Compliant DOM / SVG Helpers
	 * ========================================================================== */

	function createSvgElement<K extends keyof SVGElementTagNameMap>(
		tag: K,
		attrs: Record<string, string>,
	): SVGElementTagNameMap[K] {
		const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
		for (const [key, value] of Object.entries(attrs)) {
			el.setAttribute(key, value);
		}
		return el;
	}

	function createStyledElement<K extends keyof HTMLElementTagNameMap>(
		tag: K,
		styleText: string,
		textContent?: string,
	): HTMLElementTagNameMap[K] {
		const el = document.createElement(tag);
		el.style.cssText = styleText;
		if (textContent) el.textContent = textContent;
		return el;
	}

	function ensureKeyframeStyles() {
		if (document.getElementById("gapt-guard-style")) return;
		const styleEl = document.createElement("style");
		styleEl.id = "gapt-guard-style";
		styleEl.textContent =
			"@keyframes gapt-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }";
		document.head?.appendChild(styleEl);
	}

	type LucideIconName = "shield-check" | "shield-alert" | "alert-triangle" | "loader" | "x";

	const SHIELD_OUTLINE =
		"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z";

	const ICON_PATHS: Record<LucideIconName, readonly string[]> = {
		"shield-check": [SHIELD_OUTLINE, "m9 12 2 2 4-4"],
		"shield-alert": [SHIELD_OUTLINE, "M12 8v4", "M12 16h.01"],
		"alert-triangle": [
			"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",
			"M12 9v4",
			"M12 17h.01",
		],
		loader: ["M21 12a9 9 0 1 1-6.219-8.56"],
		x: ["M18 6 6 18", "m6 6 12 12"],
	};

	function createLucideSvg(icon: LucideIconName, size = 20): SVGSVGElement {
		const svg = createSvgElement("svg", {
			width: String(size),
			height: String(size),
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			"stroke-width": "2.2",
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
		});

		const paths = ICON_PATHS[icon] ?? [];
		for (const d of paths) {
			svg.appendChild(createSvgElement("path", { d }));
		}

		return svg;
	}

	interface ThemeConfig {
		bg: string;
		border: string;
		iconName: LucideIconName;
		iconBg: string;
		iconColor: string;
		tagText: string;
		tagBg: string;
		tagColor: string;
		glow: string;
	}

	const THEMES: Record<GuardSafetyLevel, ThemeConfig> = {
		safe: {
			bg: "linear-gradient(135deg, rgba(6, 78, 59, 0.96) 0%, rgba(4, 120, 87, 0.94) 100%)",
			border: "rgba(52, 211, 153, 0.5)",
			iconName: "shield-check",
			iconBg: "rgba(16, 185, 129, 0.25)",
			iconColor: "#6ee7b7",
			tagText: "VERIFIED FREE TRIAL",
			tagBg: "rgba(16, 185, 129, 0.2)",
			tagColor: "#a7f3d0",
			glow: "0 12px 32px -4px rgba(5, 150, 105, 0.4), 0 4px 12px -2px rgba(0, 0, 0, 0.3)",
		},
		danger: {
			bg: "linear-gradient(135deg, rgba(127, 29, 29, 0.96) 0%, rgba(185, 28, 28, 0.94) 100%)",
			border: "rgba(248, 113, 113, 0.5)",
			iconName: "shield-alert",
			iconBg: "rgba(239, 68, 68, 0.25)",
			iconColor: "#fca5a5",
			tagText: "CHARGE DETECTED",
			tagBg: "rgba(239, 68, 68, 0.2)",
			tagColor: "#fecaca",
			glow: "0 12px 32px -4px rgba(220, 38, 38, 0.4), 0 4px 12px -2px rgba(0, 0, 0, 0.3)",
		},
		warning: {
			bg: "linear-gradient(135deg, rgba(120, 53, 15, 0.96) 0%, rgba(180, 83, 9, 0.94) 100%)",
			border: "rgba(251, 191, 36, 0.5)",
			iconName: "alert-triangle",
			iconBg: "rgba(245, 158, 11, 0.25)",
			iconColor: "#fde68a",
			tagText: "MANUAL CHECK REQUIRED",
			tagBg: "rgba(245, 158, 11, 0.2)",
			tagColor: "#fef3c7",
			glow: "0 12px 32px -4px rgba(217, 119, 6, 0.4), 0 4px 12px -2px rgba(0, 0, 0, 0.3)",
		},
		scanning: {
			bg: "linear-gradient(135deg, rgba(30, 41, 59, 0.96) 0%, rgba(51, 65, 85, 0.94) 100%)",
			border: "rgba(148, 163, 184, 0.4)",
			iconName: "loader",
			iconBg: "rgba(100, 116, 139, 0.25)",
			iconColor: "#cbd5e1",
			tagText: "INSPECTING TERMS",
			tagBg: "rgba(100, 116, 139, 0.2)",
			tagColor: "#e2e8f0",
			glow: "0 12px 32px -4px rgba(0, 0, 0, 0.4), 0 4px 12px -2px rgba(0, 0, 0, 0.2)",
		},
	};

	function dismissBanner() {
		if (guardBannerElement) {
			guardBannerElement.style.opacity = "0";
			guardBannerElement.style.transform = "translateX(-50%) translateY(-10px)";
			setTimeout(() => guardBannerElement?.remove(), 250);
		}
	}

	function createBanner(evalResult: GuardEvaluation) {
		if (!document.body) return;

		ensureKeyframeStyles();

		if (!guardBannerElement) {
			guardBannerElement = createStyledElement(
				"div",
				`
				position: fixed !important;
				top: 14px !important;
				left: 50% !important;
				transform: translateX(-50%) !important;
				width: calc(100% - 28px) !important;
				max-width: 520px !important;
				z-index: 2147483647 !important;
				display: flex !important;
				align-items: flex-start !important;
				justify-content: space-between !important;
				padding: 12px 14px !important;
				border-radius: 14px !important;
				font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
				backdrop-filter: blur(16px) !important;
				-webkit-backdrop-filter: blur(16px) !important;
				transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
				opacity: 1 !important;
				box-sizing: border-box !important;
			`,
			);
			guardBannerElement.id = "gapt-checkout-safety-guard";
			document.body.appendChild(guardBannerElement);
		}

		const theme = THEMES[evalResult.level];
		guardBannerElement.style.background = theme.bg;
		guardBannerElement.style.border = `1px solid ${theme.border}`;
		guardBannerElement.style.boxShadow = theme.glow;
		guardBannerElement.style.color = "#ffffff";

		// Clear previous children
		while (guardBannerElement.firstChild) {
			guardBannerElement.removeChild(guardBannerElement.firstChild);
		}

		// Content row: [icon] [textGroup]
		const contentRow = createStyledElement(
			"div",
			"display: flex !important; align-items: flex-start !important; gap: 12px !important; flex: 1 !important; min-width: 0 !important;",
		);

		// Lucide icon container
		const iconContainer = createStyledElement(
			"div",
			`
			width: 36px !important;
			height: 36px !important;
			border-radius: 10px !important;
			display: flex !important;
			align-items: center !important;
			justify-content: center !important;
			background: ${theme.iconBg} !important;
			border: 1px solid rgba(255, 255, 255, 0.2) !important;
			color: ${theme.iconColor} !important;
			flex-shrink: 0 !important;
			margin-top: 1px !important;
		`,
		);
		const iconSvg = createLucideSvg(theme.iconName, 20);
		if (theme.iconName === "loader") {
			iconSvg.style.animation = "gapt-spin 1s linear infinite";
		}
		iconContainer.appendChild(iconSvg);
		contentRow.appendChild(iconContainer);

		// Text group: [badge] -> [title] -> [description]
		const textGroup = createStyledElement(
			"div",
			"display: flex !important; flex-direction: column !important; gap: 3px !important; min-width: 0 !important; flex: 1 !important;",
		);

		// Row 1: [badge]
		const tag = createStyledElement(
			"span",
			`
			display: inline-flex !important;
			align-items: center !important;
			font-size: 9px !important;
			font-weight: 800 !important;
			letter-spacing: 0.6px !important;
			text-transform: uppercase !important;
			background: ${theme.tagBg} !important;
			color: ${theme.tagColor} !important;
			border: 1px solid rgba(255, 255, 255, 0.16) !important;
			padding: 1.5px 6.5px !important;
			border-radius: 4px !important;
			line-height: 1.3 !important;
			width: fit-content !important;
			margin-bottom: 1px !important;
		`,
			theme.tagText,
		);
		textGroup.appendChild(tag);

		// Row 2: [title]
		const titleEl = createStyledElement(
			"span",
			"font-weight: 700 !important; font-size: 13.5px !important; line-height: 1.3 !important; color: #ffffff !important; letter-spacing: -0.2px !important;",
			evalResult.message,
		);
		textGroup.appendChild(titleEl);

		// Row 3: [description]
		if (evalResult.details) {
			const detailsEl = createStyledElement(
				"div",
				"font-size: 11.5px !important; opacity: 0.88 !important; line-height: 1.35 !important; color: #ffffff !important; margin-top: 1px !important;",
				evalResult.details,
			);
			textGroup.appendChild(detailsEl);
		}

		contentRow.appendChild(textGroup);
		guardBannerElement.appendChild(contentRow);

		// Dismiss X button
		const dismissBtn = createStyledElement(
			"button",
			`
			width: 28px !important;
			height: 28px !important;
			border-radius: 8px !important;
			display: flex !important;
			align-items: center !important;
			justify-content: center !important;
			background: rgba(255, 255, 255, 0.12) !important;
			border: 1px solid rgba(255, 255, 255, 0.15) !important;
			color: #ffffff !important;
			opacity: 0.8 !important;
			cursor: pointer !important;
			margin-left: 10px !important;
			margin-top: 1px !important;
			flex-shrink: 0 !important;
			transition: background 0.15s, opacity 0.15s !important;
		`,
		);
		dismissBtn.title = "Dismiss alert";
		dismissBtn.appendChild(createLucideSvg("x", 14));

		dismissBtn.addEventListener("mouseenter", () => {
			dismissBtn.style.background = "rgba(255, 255, 255, 0.22)";
			dismissBtn.style.opacity = "1";
		});
		dismissBtn.addEventListener("mouseleave", () => {
			dismissBtn.style.background = "rgba(255, 255, 255, 0.12)";
			dismissBtn.style.opacity = "0.8";
		});
		dismissBtn.addEventListener("click", dismissBanner);

		guardBannerElement.appendChild(dismissBtn);
	}

	function matchesAnyPattern(text: string, patterns: readonly string[]): boolean {
		return patterns.some((p) => text.includes(p));
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

		const hasFree = matchesAnyPattern(bodyText, FREE_TRIAL_PATTERNS);
		const hasPaid = matchesAnyPattern(bodyText, IMMEDIATE_CHARGE_PATTERNS);

		if (hasFree && !hasPaid) {
			return {
				level: "safe",
				message: "Verified: $0.00 Free Trial Detected",
				details: "Safe to subscribe. Always double-check that the total displays $0.00 due today.",
			};
		}

		if (hasPaid && !hasFree) {
			return {
				level: "danger",
				message: "Warning: Immediate Charge Detected!",
				details:
					"Do not subscribe! An immediate charge was detected. Switch tier or verify account region.",
			};
		}

		if (hasFree && hasPaid) {
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
		createBanner(evaluateCheckoutTerms());
	}

	// Schedule inspection passes safely (fixed intervals, no MutationObserver loop)
	[1000, 2500, 5000].forEach((ms) => setTimeout(runInspection, ms));
})();
