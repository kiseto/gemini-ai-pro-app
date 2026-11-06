import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APP_INFO } from "@/constants/app-info";
import { Sun, Moon, ExternalLink } from "lucide-react";

interface PopupHeaderProps {
	isDark: boolean;
	onToggleTheme: () => void;
	onOpenGoogleOne: () => void;
}

export function PopupHeader({ isDark, onToggleTheme, onOpenGoogleOne }: PopupHeaderProps) {
	return (
		<header className="flex items-center justify-between border-b border-border/60 bg-card/60 px-4 py-3 backdrop-blur-sm">
			<div className="flex items-center gap-2.5">
				<img src="/icons/32.png" alt={APP_INFO.shortName} className="size-7 object-contain" />
				<div>
					<div className="flex items-center gap-1.5">
						<h1 className="text-sm font-semibold tracking-tight">{APP_INFO.shortName}</h1>
						<Badge variant="outline" className="px-1 py-0 text-[10px] font-medium">
							v{APP_INFO.version}
						</Badge>
					</div>
					<p className="text-[11px] text-muted-foreground">Google One 2TB AI Premium</p>
				</div>
			</div>

			<div className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon-xs"
					onClick={onToggleTheme}
					title={isDark ? "Switch to light mode" : "Switch to dark mode"}
					className="active:scale-95 transition-transform"
				>
					{isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
				</Button>
				<Button
					variant="ghost"
					size="icon-xs"
					onClick={onOpenGoogleOne}
					title="Open one.google.com/plans"
					className="active:scale-95 transition-transform"
				>
					<ExternalLink className="size-3.5" />
				</Button>
			</div>
		</header>
	);
}

