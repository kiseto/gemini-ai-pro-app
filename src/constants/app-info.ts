export const APP_INFO = {
	name: "Google AI Pro Portal",
	shortName: "AI Pro Portal",
	version: "1.0.0",
	tagline: "Open-Source Promotional Companion & Checkout Guard for Google One",
	title: "Google AI Pro Portal",
	description:
		"An independent, client-side browser extension that helps Google One subscribers apply eligible promotional tiers and verifies checkout pricing in real time.",
	shortDescription:
		"Apply eligible promotional offer tiers with real-time checkout price verification.",
	author: "Antigravity Engineering",
	githubUrl: "https://github.com/nmrisrl11/gemini-ai-pro-app",
	githubReleasesUrl: "https://github.com/nmrisrl11/gemini-ai-pro-app/releases",
	releaseZipUrl:
		"https://github.com/nmrisrl11/gemini-ai-pro-app/releases/download/v1.0.0/google-ai-pro-portal-v1.0.0.zip",
	appUrl: "https://gemini-ai-pro-portal.vercel.app",
	ogImagePath: "/og-image.png",
	ogImageUrl: "https://gemini-ai-pro-portal.vercel.app/og-image.png",
	sitemapUrl: "https://gemini-ai-pro-portal.vercel.app/sitemap.xml",
	robotsUrl: "https://gemini-ai-pro-portal.vercel.app/robots.txt",
	llmsUrl: "https://gemini-ai-pro-portal.vercel.app/llms.txt",
	llmsFullUrl: "https://gemini-ai-pro-portal.vercel.app/llms-full.txt",
	googleOneUrl: "https://one.google.com/plans",
	googlePlaySubsUrl: "https://play.google.com/store/account/subscriptions",
	bmcUrl: "https://buymeacoffee.com/nmrisrl11",
	devUrl: "https://www.nmrisrl.dev",
	devGithub: "https://github.com/nmrisrl11",
} as const;

export const FEATURE_FLAGS = {
	/**
	 * When false, the Tokens tab is hidden by default.
	 * Can be toggled on at runtime by tapping the version badge in the popup header 5 times.
	 */
	showTokensTab: false,
} as const;
