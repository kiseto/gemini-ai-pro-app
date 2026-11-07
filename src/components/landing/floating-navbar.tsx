import { useState, useEffect } from "react";
import { APP_INFO } from "@/constants/app-info";
import { GithubIcon } from "@/components/icons";

const NAV_ITEMS = [
	{ id: "preview", label: "Preview" },
	{ id: "stacking", label: "Stacking" },
	{ id: "install", label: "Install" },
	{ id: "faq", label: "FAQ" },
] as const;

type NavSectionId = (typeof NAV_ITEMS)[number]["id"];

export function FloatingNavbar() {
	const [isVisible, setIsVisible] = useState(false);
	const [activeId, setActiveId] = useState<NavSectionId | "">("");

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			const shouldBeVisible = scrollY > 380;
			setIsVisible(shouldBeVisible);

			if (!shouldBeVisible) {
				setActiveId("");
				return;
			}

			// Scrollspy trigger offset below the floating navbar (~180px)
			const targetOffset = 180;

			// Find if any nav section currently contains the target scroll line
			const currentSection = NAV_ITEMS.find((item) => {
				const el = document.getElementById(item.id);
				if (!el) return false;
				const rect = el.getBoundingClientRect();
				return rect.top <= targetOffset && rect.bottom > targetOffset;
			});

			// Only set active if the current scroll position actually matches a nav section
			setActiveId(currentSection ? currentSection.id : "");
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: NavSectionId) => {
		if (e.button !== 0 || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
		e.preventDefault();
		const target = document.getElementById(id);
		if (target) {
			setActiveId(id);
			target.scrollIntoView({ behavior: "smooth" });
			window.history.pushState(null, "", `#${id}`);
		}
	};

	return (
		<header
			aria-label="Floating navigation"
			className={`fixed top-3.5 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ease-out sm:top-5 ${
				isVisible
					? "translate-y-0 scale-100 opacity-100"
					: "pointer-events-none -translate-y-6 scale-95 opacity-0"
			}`}
		>
			<nav className="flex max-w-[96vw] items-center gap-1 rounded-full border border-white/20 bg-card/85 p-1 pr-1 pl-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:gap-1.5 sm:p-1.5 sm:pr-1.5 sm:pl-3.5 dark:border-white/12 dark:bg-[#12100f]/90">
				{/* Nav Links */}
				<div className="flex items-center gap-0.5 text-[11px] font-medium text-muted-foreground sm:gap-1 sm:text-xs">
					{NAV_ITEMS.map((item) => {
						const isActive = activeId === item.id;
						return (
							<a
								key={item.id}
								href={`#${item.id}`}
								onClick={(e) => handleNavClick(e, item.id)}
								aria-current={isActive ? "page" : undefined}
								className={`rounded-full px-2.5 py-1 transition-all duration-200 sm:px-3 sm:py-1.5 ${
									isActive
										? "bg-primary/15 font-medium text-primary shadow-xs"
										: "font-medium text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
								}`}
							>
								{item.label}
							</a>
						);
					})}
				</div>

				<span className="mx-0.5 h-3.5 w-px bg-border/60 sm:mx-1" aria-hidden="true" />

				{/* GitHub Link */}
				<a
					href={APP_INFO.githubUrl}
					target="_blank"
					rel="noreferrer"
					aria-label="GitHub Repository"
					className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground active:scale-95"
				>
					<GithubIcon className="size-3.5" />
				</a>

				{/* CTA Button: Proportional, vertically centered white button */}
				<a
					href={APP_INFO.releaseZipUrl}
					download="google-ai-pro-portal-v1.0.0.zip"
					target="_blank"
					rel="noreferrer noopener"
					className="group relative inline-flex h-7.5 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/60 bg-linear-to-b from-white via-[#fafafa] to-[#e8e8e8] px-3.5 text-[11px] font-semibold text-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,1)] transition-all duration-200 hover:from-white hover:to-[#f2f2f2] active:scale-95 sm:h-8 sm:px-4.5 sm:text-xs"
				>
					Download
				</a>
			</nav>
		</header>
	);
}
