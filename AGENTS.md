# AGENTS.md — Developer & AI Agent Context Guide

> **Authoritative specification, architectural rules, message workflows, and coding constraints for Google AI Pro Portal.**
> All human developers and AI agents working in this repository MUST consult and adhere to this document.

---

## 1. Project Identity & Metadata

- **Application Name**: `Google AI Pro Portal`
- **Short Name**: `AI Pro Portal`
- **Repository Name**: `gemini-ai-pro-app` _(The directory and GitHub repo name must remain `gemini-ai-pro-app`)_
- **Application Version**: `1.0.0`
- **Core Purpose**: A unified monorepo containing both a modern landing page web application and an automated Manifest V3 browser extension for Google One 5TB Google AI Pro promotional offer management and Google Play checkout price verification.
- **Upstream Blueprints**:
  1. [`sulok`](https://github.com/nmrisrl11/sulok): Dual Vite configuration (`vite.config.ts` vs `vite.ext.config.ts`), `vite-plugin-web-extension`, automated extension packaging script, Tailwind CSS v4, React 19, and Radix UI / shadcn component patterns.
  2. [`google-pro-helper-main`](https://github.com/nmrisrl11/google-pro-helper-main): Checkout request interception logic, Google One protobuf SKU patching, and Google Play checkout price verification guard, re-engineered into clean, typed, idiomatic English TypeScript.

---

## 2. Strict Architectural Rules & Single Source of Truth

### Rule 2.1 — Application Metadata Single Source of Truth

- [`src/constants/app-info.ts`](file:///src/constants/app-info.ts) is the **ONLY** source of truth for all public application metadata:
  - `name`: `"Google AI Pro Portal"`
  - `shortName`: `"AI Pro Portal"`
  - `version`: `"1.0.0"`
  - `title`, `tagline`, `description`, `author`, `githubUrl`, `githubReleasesUrl`, `releaseZipUrl`, `appUrl`, `googleOneUrl`, `googlePlaySubsUrl`, `ogImagePath`, `ogImageUrl`, `sitemapUrl`, `robotsUrl`, `llmsUrl`, `llmsFullUrl`.
- **CRITICAL**: Do **NOT** reintroduce environment variables for static metadata (e.g., `VITE_APP_NAME`).

### Rule 2.2 — Environment Variables Scope

- [`.env`](file:///src/.env) and [`.env.example`](file:///src/.env.example) are reserved **STRICTLY** for private / sensitive configuration data (promotional offer tokens):
  - `VITE_OFFER_TOKEN_12M`
  - `VITE_OFFER_TOKEN_6M_SS`
  - `VITE_OFFER_TOKEN_6M`
  - `VITE_OFFER_TOKEN_6M_2`
  - `VITE_OFFER_TOKEN_YT_PREMIUM`
- [`.env`](file:///src/.env) is gitignored and must **NEVER** be committed.
- [`.env.example`](file:///src/.env.example) must **ONLY** contain placeholder dummy values (`"your_tier_1_12m_offer_token_here"`).
- Fallbacks in [`src/constants/offers.ts`](file:///src/constants/offers.ts) must remain empty strings (`""`) to prevent hardcoding tokens into source control.

### Rule 2.3 — Static Asset Unification

- All icons, favicons, and public web/SEO assets live strictly in [`public/`](file:///public/):
  - `public/favicon.ico`
  - `public/site.webmanifest`
  - `public/og-image.png` (1200x630 Open Graph preview)
  - `public/robots.txt`
  - `public/sitemap.xml`
  - `public/llms.txt`
  - `public/llms-full.txt`
  - `public/icons/` (`16.png`, `32.png`, `48.png`, `128.png`, `180.png`, `192.png`, `512.png`)
- Vite automatically copies the entire `public/` directory into `dist/` during web compilation.
- The extension packaging pipeline explicitly filters web-only assets out of `dist-ext/` and zip archives.
- **NEVER** create separate duplicate folders such as `src/extension/icons/` or `public/releases/`.

---

## 3. Extension Architecture & Multi-World Execution Flow

The extension relies on Manifest V3 with 4 coordinated execution contexts:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Extension Popup (React UI)                      │
│                  src/extension/popup.tsx & main.tsx                    │
│  - Composed with modular components (src/extension/components/*)       │
│  - Stateful logic isolated in hooks (src/extension/hooks/*)            │
│  - Connected timeline stepper in 7-Step Guide tab                      │
│  - Domain-aware detection (disables tier switches off one.google.com)  │
│  - Stealth Developer Mode (5-click easter egg on version badge)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ chrome.tabs.sendMessage
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               Content Script — Isolated World (content.ts)             │
│                     Matches: https://one.google.com/*                  │
│  - Reads/writes chrome.storage.local for layer & custom tokens         │
│  - Listens for popup runtime messages                                  │
│  - Bridges state to page context via window.postMessage                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ window.postMessage({ __gapt: 1 })
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Injector Script — MAIN World (inject.ts)               │
│                     Matches: https://one.google.com/*                  │
│                     Execution World: MAIN                              │
│  - Hooks XMLHttpRequest.prototype.send for batch requests (f.req)      │
│  - Detects Ngbm calls and patches Google One SKU protobuf payloads     │
│  - Hooks HTMLIFrameElement.prototype.src & TrustedTypePolicy           │
│  - Renders floating dark-mode status pill widget on one.google.com     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Loads Checkout Iframe
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│           Play Checkout Safety Guard — MAIN World (play-guard.ts)      │
│               Matches: https://tokenized.play.google.com/*             │
│               Execution World: MAIN, all_frames: true                  │
│  - Verifies window.top !== window (only executes inside child iframe)  │
│  - Strict CSP / TrustedTypes compliance via createStyledElement factory│
│  - Declarative ICON_PATHS map with shared SHIELD_OUTLINE Lucide SVGs   │
│  - MutationObserver & loop-driven interval scanner (1s, 2.5s, 5s)      │
│  - Identifies free trial terms ($0.00, €0.00, £0.00, won't be charged) │
│  - Identifies paid terms (/mo after, pay now, charged today)           │
│  - Renders floating high-contrast safety banner at top of iframe       │
│  - Dismisses with smooth slide-up & fade transition                    │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Request Interception Logic (`inject.ts`):

- **Protobuf Node Patching (`patchNode`)**:
  - `full_items`: Array containing the Google AI Pro 5TB SKU (`subs:com.google.android.apps.subscriptions.red:g1.2tb.ai.subs_variant`) and the active offer token.
  - If node length > 12: Updates `node[12]` to `full_items`, extracts `subId` from `node[7][5][0]`, and adjusts subscription extension mode `node[7]`.
  - If node length > 10: Updates `node[10]` and deep child arrays `node[2][2][8]`.
- **URL Parameter Rewriting (`rewriteUrl`)**:
  - Target: URLs containing `/eacquire/multiline`.
  - Parses the `ear` JSON query parameter.
  - Injects `full_items` into `ear[13][0]` and base64-encoded `ear[4][0]`.
  - Sets `ear[8]` mode and clears `ear[24]`.

### Play Checkout Safety Guard Patterns (`play-guard.ts`):

- **Declarative Icon Paths**: Uses `SHIELD_OUTLINE` and `ICON_PATHS` map to render verified Lucide SVG icons (`check-check`, `alert-triangle`, `x-circle`, `loader-2`) without imperative duplication.
- **TrustedTypes DOM Factory**: `createStyledElement<K>` provides a unified, injection-safe mechanism for creating and styling DOM nodes without `innerHTML`.
- **Dismissal Transition**: `dismissBanner` handles CSS transitions (`transform: translateY(-8px)`, `opacity: 0`) and clean DOM removal.

---

## 4. Multi-Tier Stacking Specification

The extension supports 4 promotional tiers and 1 bypass tier defined in [`src/constants/offers.ts`](file:///src/constants/offers.ts):

| Tier ID   | Display Name                | Months | Stacking Order | Purpose                                                                   |
| :-------- | :-------------------------- | :----: | :------------: | :------------------------------------------------------------------------ |
| `"12m"`   | **Tier 1 · 12 Months**      |   12   |       1        | Base initial 1-year promotional offer for new or reset subscribers.       |
| `"6m_ss"` | **Tier 2 · 6 Months (SS)**  |   6    |       2        | Applied to an active Tier 1 subscription to stack an extra 6 months.      |
| `"6m"`    | **Tier 3 · 6 Months**       |   6    |       3        | Secondary extension layer to stack another 6 months (totaling 24 months). |
| `"6m_2"`  | **Tier 4 · 6 Months (Alt)** |   6    |       -        | Alternate fallback token if Tier 2 or 3 encounters eligibility errors.    |
| `"off"`   | **Bypass / Disabled**       |   0    |       -        | Inactive; passes standard Google One checkout requests through unhooked.  |

---

## 5. Development Constraints & Tooling

### 5.1 Operating System & Command Execution (Windows)

- The host OS is **Windows** using PowerShell.
- Running `npm` or `npx` directly in PowerShell can trigger `PSSecurityException`.
- **MANDATORY**: Execute all terminal commands via `cmd /c`:
  ```powershell
  cmd /c npm run build
  cmd /c npm run lint
  cmd /c npm run pack:ext
  cmd /c git status
  ```
- Do **not** use raw PowerShell command chaining (`&&`) across `cmd /c` boundaries.

### 5.2 Code Quality & React Fast Refresh Compliance

- **Linter**: OXC (`oxlint`). Must pass with **0 warnings and 0 errors**.
- **Formatter**: OXC (`oxfmt`). Configured via `.oxfmtrc.json` with Tailwind CSS class sorting.
- **React Fast Refresh Rule**: Component files (e.g. `tabs.tsx`, `badge.tsx`, `button.tsx`) must **only** export React components.
  - Variant definitions (e.g., `cva(...)` objects) must be extracted into separate `*-variants.ts` files (e.g., `src/components/ui/tabs-variants.ts`).

### 5.3 Language & Copywriting Policy

- All UI text, documentation, comments, and commit messages must be in **professional English**.
- Do not introduce foreign language literals in code or UI strings.

### 5.4 Extension Modular Component & Hook Architecture

- **Hook Separation**: All stateful popup workflows (theme, developer mode, token management, tab messaging) MUST reside in dedicated custom hooks under `src/extension/hooks/`.
- **Component Decomposition**: Presentation panels (tabs, header, footer, status banners) MUST reside in focused components under `src/extension/components/`.
- **CSP & TrustedTypes Safety**: Content and injection scripts (`play-guard.ts`, `inject.ts`) MUST NOT use `innerHTML`. Use `createStyledElement`, `createElementNS`, `textContent`, and safe DOM manipulation.
- **Stealth Developer Mode UX**: The secret Tokens tab is unlocked strictly via 5 clicks on the popup header's version badge. Do not add explicit cursor pointers or hover indications that compromise stealth discovery.

### 5.5 SEO, Semantic HTML & Accessibility Standards

- **Title Tag Character Count**: Strictly between **50 and 60 characters** to ensure visibility across search engine result pages (SERPs) without truncation.
- **Meta Description**: Calibrated to **150–160 characters** to fit search snippet containers.
- **Image Accessibility (`<img>`)**: All `<img>` elements must specify both descriptive `alt` and `title` attributes.
- **Link Accessibility (`<a>`)**: All `<a>` anchor elements must specify descriptive `title` attributes (e.g. for in-page anchors, binary downloads, external repositories, and documentation).
- **Conventional AI Documentation**: Maintain [`public/llms.txt`](file:///public/llms.txt) and [`public/llms-full.txt`](file:///public/llms-full.txt) in compliance with the [llmstxt.org](https://llmstxt.org) standard.

---

## 6. Build & Packaging Pipelines

### Web Landing Page Build

```bash
cmd /c npm run build
```

- Orchestrated by [`vite.config.ts`](file:///vite.config.ts).
- Runs `oxlint --deny-warnings` -> `tsc -b` -> `vite build`.
- Outputs static assets and HTML to [`dist/`](file:///dist/).

### Browser Extension Build & Packaging

```bash
cmd /c npm run build:ext
cmd /c npm run pack:ext
```

- Orchestrated by [`vite.ext.config.ts`](file:///vite.ext.config.ts) using `vite-plugin-web-extension`.
- Compiles `popup.html`, `content.ts`, `inject.ts`, and `play-guard.ts` into [`dist-ext/`](file:///dist-ext/).
- Copies strictly necessary extension assets ([`public/icons/`](file:///public/icons)) into `dist-ext/`, explicitly stripping web-only assets (`images/`, `favicon.ico`, `site.webmanifest`, `og-image.png`, `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `404.html`).
- [`scripts/pack-extension.js`](file:///scripts/pack-extension.js) stages compiled `dist-ext/` assets into an `extension/` subfolder alongside `INSTRUCTIONS.txt`, then packages them using PowerShell `Compress-Archive` into [`releases/google-ai-pro-portal-v1.0.0.zip`](file:///releases).

---

## 7. Directory Map

```
gemini-ai-pro-app/
├── public/                         # Public assets (icons/ auto-copied to dist/ and dist-ext/; web assets to dist/)
│   ├── favicon.ico                 # Multi-resolution ICO (16x16 to 256x256)
│   ├── site.webmanifest            # Web application manifest
│   ├── og-image.png                # 1200x630 Open Graph / Twitter sharing image
│   ├── robots.txt                  # Search engine and AI crawler directives
│   ├── sitemap.xml                 # XML sitemap
│   ├── llms.txt                    # LLM & AI agent structured context standard
│   ├── llms-full.txt               # Expanded single-file documentation for LLMs
│   └── icons/                      # 16, 32, 48, 128, 180, 192, 512px transparent PNGs
├── src/
│   ├── App.tsx                     # Landing page parent component
│   ├── main.tsx                    # Landing page React DOM root
│   ├── index.css                   # Tailwind CSS v4 root stylesheet
│   ├── constants/
│   │   ├── app-info.ts             # SINGLE SOURCE OF TRUTH for static app metadata
│   │   └── offers.ts               # Offer tier definitions, constants, fallback tokens
│   ├── components/
│   │   ├── icons.tsx               # Brand SVG icons (GitHub, YouTube)
│   │   ├── ui/                     # Radix / shadcn accessible primitives
│   │   └── landing/                # Modular landing page sections (Hero, Preview, Stacking, Install, FAQ, Support, Download, Footer, NotFoundPage)
│   └── extension/                  # Manifest V3 Extension Source
│       ├── components/             # Modular Popup UI components
│       │   ├── guide-tab.tsx       # Connected timeline 7-step guide
│       │   ├── popup-footer.tsx    # Footer with Play Subs & source links
│       │   ├── popup-header.tsx    # Header with theme toggle & stealth dev trigger
│       │   ├── popup-status-banner.tsx # Domain-aware status advisory banner
│       │   ├── tiers-tab.tsx       # Tier selection cards with status indicators
│       │   └── tokens-tab.tsx      # Stealth developer token overrides tab
│       ├── hooks/                  # Custom React hooks for extension state
│       │   ├── use-custom-tokens.ts # Token override loading, validation & storage
│       │   ├── use-developer-mode.ts # 5-click easter egg detector
│       │   ├── use-extension-sync.ts # Chrome tab status & content-script bridge
│       │   └── use-theme.ts        # Dark/light theme sync with document class
│       ├── extension.css           # Lightweight system-font stylesheet for extension popup
│       ├── manifest.json           # Manifest V3 specification
│       ├── popup.html              # Popup HTML template
│       ├── main.tsx                # Popup React DOM root
│       ├── popup.tsx               # Popup UI orchestrator composing components & hooks
│       ├── content.ts              # Isolated-world content script (storage bridge)
│       ├── inject.ts               # MAIN-world interceptor (XHR / URL rewrite + status pill)
│       ├── play-guard.ts           # Google Play checkout safety guard (tokenized.play.google.com)
│       ├── token-config.ts         # Merges environment tokens with local storage overrides
│       └── types.ts                # TypeScript interfaces and messaging contracts
├── scripts/
│   └── pack-extension.js           # Extension zip packager script
├── releases/                       # Packaged extension ZIP archives (gitignored)
├── .env.example                    # Template for private promotional offer tokens
├── .env                            # Local private tokens configuration (gitignored)
├── vite.config.ts                  # Vite configuration for Web Landing Page
├── vite.ext.config.ts              # Vite configuration for Browser Extension
├── vercel.json                     # Vercel SPA routing and rewrite rules
├── AGENTS.md                       # This agent specification document
├── README.md                       # Public product documentation
└── package.json                    # Project dependencies and npm scripts
```
