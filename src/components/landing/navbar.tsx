import { Download, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APP_INFO } from "@/constants/app-info";
import { GithubIcon } from "@/components/icons";

interface NavbarProps {
	isDark: boolean;
	onToggleTheme: () => void;
}

export function Navbar({ isDark, onToggleTheme }: NavbarProps) {
	return (
		<header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
			<div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
				{/* Brand */}
				<a href="#" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
					<img src="/icons/32.png" alt={APP_INFO.name} className="size-8 object-contain" />
					<div>
						<div className="flex items-center gap-2">
							<span className="font-bold tracking-tight text-foreground sm:text-base">
								{APP_INFO.name}
							</span>
							<Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-medium">
								v{APP_INFO.version}
							</Badge>
						</div>
					</div>
				</a>

				{/* Nav Links */}
				<nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
					<a href="#features" className="transition-colors hover:text-foreground">
						Features
					</a>
					<a href="#stacking" className="transition-colors hover:text-foreground">
						Stacking
					</a>
					<a href="#workflow" className="transition-colors hover:text-foreground">
						How It Works
					</a>
					<a href="#install" className="transition-colors hover:text-foreground">
						Install Guide
					</a>
					<a href="#faq" className="transition-colors hover:text-foreground">
						FAQ
					</a>
				</nav>

				{/* Right Actions */}
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="icon-sm"
						onClick={onToggleTheme}
						aria-label="Toggle theme"
						title={isDark ? "Switch to light mode" : "Switch to dark mode"}
					>
						{isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
					</Button>

					<Button variant="outline" size="icon-sm" asChild>
						<a
							href={APP_INFO.githubUrl}
							target="_blank"
							rel="noreferrer"
							title="View GitHub Repository"
						>
							<GithubIcon className="size-4" />
						</a>
					</Button>

					<Button size="sm" asChild className="hidden sm:inline-flex">
						<a href="#install" className="flex items-center gap-1.5">
							<Download className="size-3.5" />
							Get Extension
						</a>
					</Button>
				</div>
			</div>
		</header>
	);
}
