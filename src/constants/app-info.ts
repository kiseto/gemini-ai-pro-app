const getEnv = (key: string, fallback: string): string => {
	if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
		return import.meta.env[key] as string;
	}
	if (typeof process !== "undefined" && process.env && process.env[key]) {
		return process.env[key] as string;
	}
	return fallback;
};

export const APP_INFO = {
	name: getEnv("VITE_APP_NAME", "Google AI Pro Portal"),
	shortName: getEnv("VITE_APP_SHORT_NAME", "AI Pro Portal"),
	version: getEnv("VITE_APP_VERSION", "1.0.0"),
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
	appUrl: getEnv("VITE_APP_URL", "https://gemini-ai-pro.pages.dev"),
	googleOneUrl: "https://one.google.com/plans",
	googlePlaySubsUrl: "https://play.google.com/store/account/subscriptions",
} as const;
