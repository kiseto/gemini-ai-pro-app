# Gemini AI Pro App

A modern, production-ready React application initialized with the latest ecosystem tools.

## Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler & Dev Server**: [Vite 8](https://vite.dev/)
- **Language**: [TypeScript 7](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first engine with `@theme inline`)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (using Radix UI primitives & Nova preset)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: [Geist Font](https://vercel.com/font) (`@fontsource-variable/geist`)

## Project Structure

```
├── src/
│   ├── components/
│   │   └── ui/          # shadcn/ui components (Button, Card, Badge)
│   ├── lib/
│   │   └── utils.ts     # Class merging utility (cn)
│   ├── App.tsx          # Main application page
│   ├── index.css        # Tailwind v4 configuration and shadcn tokens
│   └── main.tsx         # Application entry point
├── components.json      # shadcn configuration
├── tsconfig.json        # TypeScript root configuration
├── tsconfig.app.json    # Application TypeScript configuration with @/* alias
├── vite.config.ts       # Vite configuration with @tailwindcss/vite and path aliases
└── package.json
```

## Getting Started

### Development
Start the local development server:
```bash
npm run dev
```

### Production Build
Type-check and bundle for production:
```bash
npm run build
```

### Type Checking / Lint
```bash
npm run lint
```

### Preview Build
Preview the production build locally:
```bash
npm run preview
```

## Adding More shadcn/ui Components

To add additional shadcn/ui components:
```bash
npx shadcn@latest add <component-name>
```

Examples:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add input
```
