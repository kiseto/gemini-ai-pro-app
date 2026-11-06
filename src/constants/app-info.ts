export const APP_INFO = {
	name: "Google AI Pro Portal",
	shortName: "AI Pro Portal",
	version: "1.0.0",
	tagline: "Smart Subscription & Offer Injector for Google AI Pro",
	title: "Google AI Pro Portal — Streamline & Verify Google AI Pro Benefits",
	description:
		"An intelligent, client-side browser extension and companion tool that injects promotional offer tokens and guards your checkout for Google One 2TB AI Premium tier.",
	shortDescription:
		"Inject eligible promotional offer tokens with real-time $0.00 checkout protection.",
	author: "Antigravity Engineering",
	githubUrl: "https://github.com/nmrisrl11/gemini-ai-pro-app",
	githubReleasesUrl: "https://github.com/nmrisrl11/gemini-ai-pro-app/releases",
	releaseZipUrl:
		"https://github.com/nmrisrl11/gemini-ai-pro-app/releases/download/v1.0.0/google-ai-pro-portal-v1.0.0.zip",
	appUrl: "https://gemini-ai-pro.pages.dev",
	googleOneUrl: "https://one.google.com/plans",
	googlePlaySubsUrl: "https://play.google.com/store/account/subscriptions",
} as const;

export const FEATURE_FLAGS = {
	/**
	 * When false, the Tokens tab is hidden by default.
	 * Can be toggled on at runtime by tapping the version badge in the popup header 5 times.
	 */
	showTokensTab: false,
} as const;
