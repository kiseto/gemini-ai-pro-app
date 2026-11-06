import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APP_INFO } from "@/constants/app-info";
import { Sun, Moon, ExternalLink } from "lucide-react";

interface PopupHeaderProps {
	isDark: boolean;
	onToggleTheme: () => void;
	onOpenGoogleOne: () => void;
	onVersionClick?: () => void;
}

export function PopupHeader({
	isDark,
	onToggleTheme,
	onOpenGoogleOne,
	onVersionClick,
}: PopupHeaderProps) {
	return (
		<header className="flex items-center justify-between border-b border-border/60 bg-card/60 px-4 py-3 backdrop-blur-sm">
			<div className="flex items-center gap-2.5">
				<img src="/icons/32.png" alt={APP_INFO.shortName} className="size-7 object-contain" />
				<div>
					<div className="flex items-center gap-1.5">
						<h1 className="text-sm font-semibold tracking-tight">{APP_INFO.name}</h1>
						<Badge
							variant="outline"
							onClick={onVersionClick}
							className="cursor-default select-none px-1 py-0 text-[10px] font-medium"
						>
							v{APP_INFO.version}
						</Badge>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon-xs"
					onClick={onToggleTheme}
					title={isDark ? "Switch to light mode" : "Switch to dark mode"}
					className="transition-transform active:scale-95"
				>
					{isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
				</Button>
				<Button
					variant="ghost"
					size="icon-xs"
					onClick={onOpenGoogleOne}
					title="Open one.google.com/plans"
					className="transition-transform active:scale-95"
				>
					<ExternalLink className="size-3.5" />
				</Button>
			</div>
		</header>
	);
}
