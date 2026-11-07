import { APP_INFO } from "@/constants/app-info";
import { ChevronRight } from "lucide-react";

export function PopupFooter() {
	return (
		<footer className="flex items-center justify-between border-t border-border/60 bg-muted/30 px-4 py-2.5 text-[10.5px] text-muted-foreground">
			<span>Client-side only · Zero telemetry</span>
			<a
				href={APP_INFO.githubUrl}
				target="_blank"
				rel="noreferrer"
				className="flex items-center gap-1 transition-colors hover:text-foreground"
			>
				Source Code <ChevronRight className="size-3" />
			</a>
		</footer>
	);
}
