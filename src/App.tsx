import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Zap,
  Code2,
  CheckCircle2,
  ExternalLink,
  Sun,
  Moon,
  Component,
  Boxes,
} from 'lucide-react'

export function App() {
  const [count, setCount] = useState(0)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  const techStack = [
    {
      name: 'Vite 8',
      desc: 'Next-generation frontend tooling with lightning fast HMR',
      badge: 'v8.3',
      icon: Zap,
      color: 'text-amber-500',
    },
    {
      name: 'React 19',
      desc: 'Latest React with modern server & client primitive features',
      badge: 'v19.3',
      icon: Code2,
      color: 'text-sky-500',
    },
    {
      name: 'TypeScript 7',
      desc: 'Latest TypeScript with enhanced type safety & modern bundler syntax',
      badge: 'v7.0',
      icon: Component,
      color: 'text-blue-500',
    },
    {
      name: 'Tailwind CSS v4',
      desc: 'Engineered for speed with CSS-first configuration and @theme inline',
      badge: 'v4.3',
      icon: Sparkles,
      color: 'text-teal-500',
    },
    {
      name: 'shadcn/ui',
      desc: 'Accessible, customizable components built on modern Radix UI primitives',
      badge: 'v4.2',
      icon: Boxes,
      color: 'text-violet-500',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <span>Gemini AI Pro Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setIsDark((prev) => !prev)}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button variant="default" size="sm" asChild>
              <a
                href="https://ui.shadcn.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5"
              >
                Docs <ExternalLink className="size-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:py-16">
        {/* Hero Section */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex justify-center">
            <Badge variant="secondary" className="px-3 py-1 gap-1.5 text-xs font-semibold">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              All Systems Operational &bull; 0 Warnings
            </Badge>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Latest Vite React + Tailwind v4 + shadcn/ui
          </h1>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            A clean, modern React 19 template powered by TypeScript, Tailwind CSS v4, and shadcn/ui with zero dependency warnings.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => setCount((prev) => prev + 1)}
              className="gap-2 cursor-pointer shadow-sm"
            >
              Interactive Counter: {count}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCount(0)}
              className="cursor-pointer"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <section className="mt-16 sm:mt-20">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight">
            Integrated Modern Stack
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {techStack.map((tech) => {
              const Icon = tech.icon
              return (
                <Card key={tech.name} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className={`p-2 rounded-lg bg-muted ${tech.color}`}>
                          <Icon className="size-5" />
                        </span>
                        <CardTitle>{tech.name}</CardTitle>
                      </div>
                      <Badge variant="outline">{tech.badge}</Badge>
                    </div>
                    <CardDescription className="pt-2 text-sm text-muted-foreground leading-relaxed">
                      {tech.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <CheckCircle2 className="size-3 text-emerald-500" />
                      <span>Configured & verified</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        <p>Built with Vite, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui</p>
      </footer>
    </div>
  )
}

export default App
