# Google AI Pro Portal

<div align="center">

![Google AI Pro Portal Banner](/public/icons/128.png)

**An intelligent client-side browser extension and companion web portal for Google One 2TB AI Premium promotional subscriptions.**

[![React 19](https://img.shields.io/badge/React-19.3-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite 8](https://img.shields.io/badge/Vite-8.3-646cff.svg?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Manifest V3](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-4285F4.svg?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-Zero_%2F_Client--Side-brightgreen.svg)]()

[Features](#-key-features) • [Architecture](#-architecture--blueprint) • [How It Works](#-how-it-works-under-the-hood) • [Stacking Guide](#-multi-tier-stacking) • [Installation](#-how-to-install-the-extension) • [Tech Stack](#-tech-stack) • [Development](#-development--scripts)

</div>

---

## 📖 What is Google AI Pro Portal?

**Google AI Pro Portal** is a dual-target project providing:
1. **A modern, high-performance web landing page**: Featuring an interactive live simulator, 4-tier stacking visualizer, step-by-step tutorial, FAQ accordion, and release download links.
2. **A Manifest V3 browser extension**: An intelligent client-side utility that mounts on `https://one.google.com/plans`. It intercepts checkout requests to inject promotional offer tokens for the **Google One 2TB AI Premium** plan and provides an automated **Price Safety Guard** inside Google Play iframes to guarantee users never confirm an unexpected paid charge.

---

## 🎯 Key Features

- **⚡ One-Click Promotional Tier Injection**: Instantly activate eligible promotional tokens for **Tier 1 (12 Months)**, **Tier 2 (6 Months SS)**, **Tier 3 (6 Months)**, and **Tier 4 (6 Months Backup)**, with optional YouTube Premium add-on token support.
- **🛡️ Google Play Checkout Safety Guard**: Inspects live checkout terms inside `tokenized.play.google.com` iframes. Renders high-visibility floating status alerts:
  - 🟢 **Safe ($0.00 Trial)**: Confirms genuine zero-charge trial status.
  - 🔴 **Danger (Unexpected Charge)**: Warns immediately if a monthly/annual charge is detected so you never confirm an unexpected billing.
  - 🟡 **Warning / Inspecting**: Advises manual review if conflicting terms appear.
- **🔄 Multi-Tier Promotional Stacking**: Visualizes and guides consecutive stacking sequences (e.g. 12M initial + 6M renewal + 6M extension) allowing eligible accounts to unlock extended promotional benefits.
- **🎨 Modern React 19 + Tailwind CSS v4 UI**: Built using Radix UI primitives and styled with Tailwind v4 CSS-first theming. Supports automatic system dark/light mode synchronization.
- **🔒 Zero-Telemetry & Client-Side Privacy**: Runs 100% locally in your browser. No external API servers, no telemetry, no analytics, and zero tracking.
- **⚙️ Configurable Token Overrides**: All tokens can be overridden directly in the extension popup's **Settings** tab and stored locally in `chrome.storage.local`.
- **📦 Clean Dual-Build Pipeline**: Single unified monorepo leveraging Vite 8 and `vite-plugin-web-extension` to build both the static web landing page (`dist/`) and the unpackable extension (`dist-ext/`).

---

## 🏗️ Architecture & Blueprint

Google AI Pro Portal bridges the architectural foundation of [sulok](https://github.com/nmrisrl11/sulok) with modernized checkout injection logic from [google-pro-helper-main](https://github.com/nmrisrl11/google-pro-helper-main), re-engineered to strict production standards:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Google AI Pro Portal                            │
├──────────────────────────────────┬─────────────────────────────────────┤
│      Landing Page (Web SPA)      │    Browser Extension (Manifest V3)  │
│  - Hero with Interactive Mockup  │  - React Popup with Tier Selector   │
│  - Stacking Visualizer Timeline  │  - Isolated World Bridge (content)  │
│  - 7-Step Workflow Guide         │  - MAIN World Interceptor (inject)  │
│  - Interactive FAQ & Manual      │  - Play Checkout Guard (play-guard) │
└──────────────────────────────────┴─────────────────────────────────────┘
```

### Upstream Blueprint Improvements:
- **100% TypeScript**: Fully typed messaging contracts (`types.ts`), strict compiler settings, and runtime message discriminators.
- **English UX Copywriting**: Clean, professional naming conventions, docstrings, and UI copywriting throughout.
- **Strict Separation of Concerns**: Static metadata lives in `src/constants/app-info.ts` (single source of truth); sensitive tokens are externalized into `.env` or input via `chrome.storage.local`.
- **Fast Refresh & Lint Compliance**: Strict adherence to OXC (`oxlint`) with zero warnings and zero errors.

---

## 🔍 How It Works Under the Hood

The extension coordinates three distinct execution contexts in compliance with Chrome Manifest V3:

```
[ Extension Popup (React UI) ]
            │
            │ chrome.tabs.sendMessage
            ▼
[ Content Script (Isolated World: content.ts) ]
  • Synchronizes chrome.storage.local
  • Dispatches config to page context via window.postMessage
            │
            │ window.postMessage({ __gapt: 1, type: "cfg", ... })
            ▼
[ Injector Script (MAIN World: inject.ts) ]
  • Intercepts XMLHttpRequest.prototype.send (Ngbm batch calls, f.req body)
  • Patches Google One SKU protobuf nodes with promotional offer tokens
  • Intercepts HTMLIFrameElement.prototype.src & TrustedTypePolicy (/eacquire/multiline)
  • Renders floating dark-mode status pill on one.google.com
            │
            ▼
[ Google Play Checkout Iframe (tokenized.play.google.com: play-guard.ts) ]
  • MutationObserver monitors rendered pricing terms
  • Detects "$0.00", "free trial", "won't be charged" vs "/mo after", "pay now"
  • Displays high-contrast Safety Alert Banner at top of iframe
```

---

## 🔄 Multi-Tier Stacking

Google One allows promotional offer stacking across eligible billing transitions. The portal guides users through consecutive tiers:

| Tier | Duration | Type | Recommended Order | Description |
| :--- | :---: | :---: | :---: | :--- |
| **Tier 1** | **12 Months** | Introductory | 1st Activation | Initial 1-year promotional offer for new or reset subscribers. |
| **Tier 2** | **6 Months (SS)** | Stacking A | 2nd Activation | Applied while Tier 1 is active to stack an additional 6 months. |
| **Tier 3** | **6 Months** | Stacking B | 3rd Activation | Secondary extension stacking an additional 6 months (totaling 24M). |
| **Tier 4** | **6 Months (Alt)**| Alternate | Fallback | Backup promotional token if Tier 2 or Tier 3 encounters eligibility errors. |
| **Off** | **0 Months** | Bypass | Standard | Standard Google One checkout without promotional injection. |

---

## 💻 Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) | Component architecture for both landing page & extension popup |
| **Bundler & Build Tool** | [Vite 8](https://vite.dev/) | Blazing-fast compilation, HMR, and sub-build orchestration |
| **Extension Tooling** | [vite-plugin-web-extension](https://github.com/aklinker1/vite-plugin-web-extension) | Manifest V3 bundling, multi-world scripting, and asset output |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | End-to-end type safety, interfaces, and discriminated unions |
| **CSS Engine** | [Tailwind CSS v4](https://tailwindcss.com/) | Next-generation CSS-first engine with `@theme` token system |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com/) | Accessible component primitives (`@radix-ui/react-slot`, dialogs, tabs) |
| **Design System** | [shadcn/ui](https://ui.shadcn.com/) | Clean, accessible components with customizable variant styling |
| **Linter & Formatter** | [OXC](https://oxc.rs/) (`oxlint` & `oxfmt`) | High-speed Rust-based code verification with Tailwind class sorting |
| **Typography & Icons** | [Geist Font](https://vercel.com/font) + [Lucide](https://lucide.dev/) | Clean typography and consistent iconography |

---

## 📁 Repository Structure

```
gemini-ai-pro-app/
├── public/                         # Unified static assets (copied to dist/ and dist-ext/)
│   ├── favicon.ico                 # Root favicon
│   ├── site.webmanifest            # PWA manifest
│   └── icons/                      # Standard icons (16, 32, 48, 128, 180, 192, 512px)
├── src/
│   ├── App.tsx                     # Landing page main component
│   ├── main.tsx                    # Landing page entrypoint
│   ├── index.css                   # Tailwind CSS v4 root stylesheet
│   ├── constants/
│   │   ├── app-info.ts             # SINGLE SOURCE OF TRUTH for app metadata & URLs
│   │   └── offers.ts               # Tier configurations, offer schemas, and constants
│   ├── components/
│   │   ├── icons.tsx               # Custom SVG brand icons (GitHub, YouTube)
│   │   ├── ui/                     # shadcn/ui primitives (Button, Badge, Tabs, Dialog, etc.)
│   │   └── landing/                # Modular landing page sections:
│   │       ├── navbar.tsx          # Sticky navigation with theme toggle & release link
│   │       ├── hero.tsx            # Hero section with live interactive extension simulator
│   │       ├── features-grid.tsx   # 6 core feature highlights
│   │       ├── stacking-visualizer.tsx # Interactive 4-tier stacking timeline
│   │       ├── workflow-steps.tsx  # 7-step process walkthrough
│   │       ├── install-guide.tsx   # Manual installation instructions & ZIP download
│   │       ├── faq-section.tsx     # Frequently asked questions accordion
│   │       └── footer.tsx          # Brand footer with quick navigation links
│   └── extension/                  # Manifest V3 Extension Source
│       ├── manifest.json           # Manifest V3 specification
│       ├── popup.html              # Popup container HTML
│       ├── main.tsx                # React DOM mount for extension popup
│       ├── popup.tsx               # Popup UI (Tiers Selector, 7-Step Guide, Token Settings)
│       ├── content.ts              # Isolated-world content script (storage bridge)
│       ├── inject.ts               # MAIN-world interceptor (XHR / URL rewrite + status pill)
│       ├── play-guard.ts           # Google Play checkout safety guard (tokenized.play.google.com)
│       ├── token-config.ts         # Token resolver merging environment with local storage
│       └── types.ts                # TypeScript interfaces and messaging contracts
├── scripts/
│   └── pack-extension.js           # Packages dist-ext/ into releases/google-ai-pro-portal-v1.0.0.zip
├── releases/                       # Packaged extension ZIP archives (gitignored)
├── .env.example                    # Template for private promotional offer tokens
├── .env                            # Local private tokens configuration (gitignored)
├── vite.config.ts                  # Vite configuration for Web Landing Page
├── vite.ext.config.ts              # Vite configuration for Browser Extension
└── package.json                    # Project scripts and dependencies
```

---

## ⚙️ Configuration & Environment Variables

### Single Source of Truth:
- **Application Metadata**: [`src/constants/app-info.ts`](file:///src/constants/app-info.ts) is the sole source of truth for app name, version, URLs, and descriptions.
- **Sensitive Tokens**: [`.env`](file:///src/.env) is reserved **exclusively** for promotional offer tokens.

Create your local `.env` by copying `.env.example`:
```bash
cp .env.example .env
```

Contents of `.env`:
```bash
# Promotional Offer Tokens (Base64 Encoded Payloads)
# Configure your private promotional tokens below:
VITE_OFFER_TOKEN_12M="your_tier_1_12m_offer_token_here"
VITE_OFFER_TOKEN_6M_SS="your_tier_2_6m_ss_offer_token_here"
VITE_OFFER_TOKEN_6M="your_tier_3_6m_offer_token_here"
VITE_OFFER_TOKEN_6M_2="your_tier_4_6m_backup_offer_token_here"
VITE_OFFER_TOKEN_YT_PREMIUM="your_youtube_premium_addon_token_here"
```

> [!TIP]
> Tokens can also be edited or overridden live at any time without rebuilding by navigating to the **Settings** tab in the extension popup.

---

## 🚀 How to Install the Extension

### Method 1: Load Unpacked from Source (Recommended for Developers)
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Build the extension bundle:
   ```bash
   npm run build:ext
   ```
3. Open your Chromium-based browser (Chrome, Brave, Edge, Opera) and navigate to `chrome://extensions/`.
4. Enable **Developer mode** (toggle in top-right corner).
5. Click **Load unpacked** (top-left button).
6. Select the **`dist-ext`** folder generated in this repository.

### Method 2: Install from Pre-Packaged Release ZIP
1. Download `google-ai-pro-portal-v1.0.0.zip` from [Releases](https://github.com/nmrisrl11/gemini-ai-pro-app/releases) or build it locally with:
   ```bash
   npm run pack:ext
   ```
2. Extract the ZIP archive into a dedicated folder.
3. In `chrome://extensions/` with **Developer mode** enabled, click **Load unpacked** and select the extracted folder.

---

## 🛠️ Development & Scripts

| Command | Action | Output / Description |
| :--- | :--- | :--- |
| `npm run dev` | Start web development server | Runs landing page on `http://localhost:5173` with HMR |
| `npm run dev:ext` | Watch-mode extension build | Watches and builds extension changes into `dist-ext/` |
| `npm run build` | Full landing page build | Type-checks (`tsc -b`), lints (`oxlint`), and bundles to `dist/` |
| `npm run build:ext` | Production extension build | Bundles all Manifest V3 entrypoints into `dist-ext/` |
| `npm run pack:ext` | Build & zip extension | Builds extension and generates `releases/google-ai-pro-portal-v*.zip` |
| `npm run lint` | Run linter | Fast Rust-based linting via `oxlint` (0 warnings policy) |
| `npm run format` | Format codebase | Formats TypeScript, HTML, and CSS with `oxfmt` |
| `npm run format:check` | Check code formatting | Verifies formatting compliance across all files |
| `npm run preview` | Preview production build | Serves the production `dist/` bundle locally |

---

## ⚠️ Disclaimer & Safety Notice

1. **Educational & Research Purpose**: This software is an open-source educational utility developed to demonstrate client-side web request interception, Manifest V3 architectures, and checkout safety verification.
2. **Checkout Verification**: Always verify the final checkout terms displayed inside the Google Play modal before confirming any subscription. The built-in safety guard is designed to assist you, but manual verification of the final **$0.00** charge remains your responsibility.
3. **Trademark Notice**: This project is independent and is not affiliated, endorsed, or sponsored by Google LLC, Alphabet Inc., or any of their subsidiaries. Google One, Google Play, Gemini, and YouTube Premium are trademarks of Google LLC.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
