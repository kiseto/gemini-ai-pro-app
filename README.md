# Google AI Pro Portal

A unified repository containing a **modern product landing page** and an **automated browser extension** (Manifest V3) for Google One 2TB AI Premium promotional subscriptions.

---

## Architecture & Blueprint

This repository combines the clean build and extension architecture from [sulok](https://github.com/nmrisrl11/sulok) with the checkout injection and price guard logic from [google-pro-helper-main](https://github.com/nmrisrl11/google-pro-helper-main), rebuilt with:

- **100% TypeScript** with typed Chrome runtime messaging and discriminative unions.
- **Tailwind CSS v4** + **shadcn/ui** components for both the landing page and extension popup.
- **English UX Copywriting**: Clean, professional naming conventions and documentation throughout.
- **Sensitive Data & Token Protection**: All Base64 promotional tokens are externalized into environment variables (`.env`) with support for live in-popup overrides.
- **Automated $0.00 Price Guard**: Real-time iframe inspection in Google Play checkout to guarantee you never confirm an unexpected charge.
- **Multi-Tier Stacking**: Sequence consecutive promotional tiers (Tier 1: 12M + Tier 2: 6M + Tier 3: 6M) to unlock up to 24 months of benefits.

---

## Tech Stack

| Layer                  | Technology                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| **Framework**          | [React 19](https://react.dev/)                                                                    |
| **Bundler & HMR**      | [Vite 8](https://vite.dev/)                                                                       |
| **Extension Tooling**  | [vite-plugin-web-extension](https://github.com/aklinker1/vite-plugin-web-extension) (Manifest V3) |
| **Language**           | [TypeScript](https://www.typescriptlang.org/)                                                     |
| **Styling**            | [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first engine with `@theme inline`)               |
| **Components**         | [shadcn/ui](https://ui.shadcn.com/) + Radix UI primitives                                         |
| **Linter & Formatter** | [OXC](https://oxc.rs/) (`oxlint` & `oxfmt`)                                                       |
| **Icons & Typography** | [Lucide React](https://lucide.dev/) + [Geist Font](https://vercel.com/font)                       |

---

## Repository Structure

```
gemini-ai-pro-app/
├── src/
│   ├── App.tsx                     # Landing page app
│   ├── main.tsx                    # Landing page entry point
│   ├── index.css                   # Tailwind v4 configuration and tokens
│   ├── constants/
│   │   ├── app-info.ts             # Application metadata and external URLs
│   │   └── offers.ts               # Tier configurations and fallback tokens
│   ├── components/
│   │   ├── ui/                     # shadcn/ui primitives (Button, Badge, Tabs, Dialog, etc.)
│   │   └── landing/                # Landing page sections (Hero, Simulator, Stacking, FAQ, etc.)
│   └── extension/
│       ├── manifest.json           # Manifest V3 specification
│       ├── popup.html              # Extension popup container
│       ├── main.tsx                # React DOM root for popup
│       ├── popup.tsx               # Polished React popup UI with Tier Selector & Token Settings
│       ├── content.ts              # Isolated-world content script (storage & messaging bridge)
│       ├── inject.ts               # MAIN-world script (XHR & URL rewrite + floating status pill)
│       ├── play-guard.ts           # Checkout safety guard for tokenized.play.google.com
│       ├── types.ts                # TypeScript interfaces and messaging contracts
│       ├── token-config.ts         # Token resolver merging .env and local overrides
│       └── icons/                  # 16px, 48px, 128px extension icons
├── scripts/
│   └── pack-extension.js           # Creates releases/google-ai-pro-portal-v*.zip archive
├── .env.example                    # Template documenting all environment variables
├── .env                            # Local environment configuration (gitignored)
├── vite.config.ts                  # Vite config for landing page build
├── vite.ext.config.ts              # Vite config for extension build (vite-plugin-web-extension)
└── package.json
```

---

## Environment Variables

All promotional tokens are defined in `.env` (copy from `.env.example`):

```bash
# Public Application Metadata
VITE_APP_NAME="Google AI Pro Portal"
VITE_APP_SHORT_NAME="AI Pro Portal"
VITE_APP_URL="https://gemini-ai-pro.pages.dev"
VITE_APP_VERSION="1.0.0"

# Promotional Offer Tokens (Base64 Payloads)
# Configure these in your private .env file
VITE_OFFER_TOKEN_12M="your_tier_1_12m_offer_token_here"
VITE_OFFER_TOKEN_6M_SS="your_tier_2_6m_ss_offer_token_here"
VITE_OFFER_TOKEN_6M="your_tier_3_6m_offer_token_here"
VITE_OFFER_TOKEN_6M_2="your_tier_4_6m_backup_offer_token_here"
VITE_OFFER_TOKEN_YT_PREMIUM="your_youtube_premium_addon_token_here"
```

---

## Available Scripts

### Extension Workflow

- **`npm run dev:ext`**: Launches Vite in watch mode targeting the browser extension.
- **`npm run build:ext`**: Bundles all extension entrypoints into `dist-ext/`.
- **`npm run pack:ext`**: Builds the extension and packages `releases/google-ai-pro-portal-v1.0.0.zip` ready for distribution.

### Web Landing Page Workflow

- **`npm run dev`**: Starts the local development server for the landing page (`http://localhost:5173`).
- **`npm run build`**: Type-checks (`tsc -b`), lints (`oxlint`), and bundles the landing page into `dist/`.
- **`npm run preview`**: Previews the production build of the landing page.

### Code Quality

- **`npm run lint`**: Runs OXC linter (`oxlint`).
- **`npm run format`**: Formats all files with `oxfmt`.
- **`npm run format:check`**: Verifies formatting.

---

## How to Install the Extension in Your Browser

1. Run `npm run build:ext` (or download the pre-packaged ZIP from `releases/`).
2. Open Google Chrome, Brave, or Edge and navigate to `chrome://extensions/`.
3. Toggle **Developer mode** in the upper-right corner.
4. Click **Load unpacked** in the top-left corner.
5. Select the **`dist-ext`** folder in this repository.
6. The extension is now loaded and will automatically mount on `https://one.google.com/plans`.

---

## Disclaimer

This project is an open-source educational and productivity utility. It is not affiliated, sponsored, or endorsed by Google LLC or Alphabet Inc.
