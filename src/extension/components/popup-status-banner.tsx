import { Button } from "@/components/ui/button";
import { OFFER_TIERS, type OfferTierId } from "@/constants/offers";
import { CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

interface PopupStatusBannerProps {
	isMounted: boolean;
	isOnGoogleOne: boolean;
	selectedLayer: OfferTierId;
	isRefreshing: boolean;
	onReloadPage: () => void;
	onOpenGoogleOne: () => void;
}

export function PopupStatusBanner({
	isMounted,
	isOnGoogleOne,
	selectedLayer,
	isRefreshing,
	onReloadPage,
	onOpenGoogleOne,
}: PopupStatusBannerProps) {
	return (
		<div className="p-3">
			{isMounted ? (
				<div className="flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-700 dark:text-emerald-400">
					<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
					<div className="flex-1 text-xs">
						<div className="leading-tight font-semibold">
							Active: {OFFER_TIERS[selectedLayer]?.shortName || selectedLayer}
						</div>
						<div className="mt-0.5 text-[11px] opacity-90">
							Offer token mounted. Click &ldquo;Get discount&rdquo; on the AI Pro card.
						</div>
					</div>
				</div>
			) : isOnGoogleOne ? (
				<div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-amber-800 dark:text-amber-300">
					<AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
					<div className="flex-1 text-xs">
						<div className="leading-tight font-semibold">Injection Pending Refresh</div>
						<div className="mt-0.5 text-[11px] opacity-90">
							Refresh the plans page to mount the selected offer token.
						</div>
					</div>
					<Button
						variant="outline"
						size="xs"
						onClick={onReloadPage}
						disabled={isRefreshing}
						className="h-6 border-amber-500/40 text-[11px]"
					>
						<RefreshCw className={`size-3 ${isRefreshing ? "animate-spin" : ""}`} />
						Refresh
					</Button>
				</div>
			) : (
				<div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/40 p-2.5 text-muted-foreground">
					<AlertTriangle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
					<div className="flex-1 text-xs">
						<div className="font-medium text-foreground">Google One Plans Not Detected</div>
						<div className="mt-0.5 text-[11px]">
							Open Google One Plans to activate the offer injector.
						</div>
					</div>
					<Button
						variant="secondary"
						size="xs"
						onClick={onOpenGoogleOne}
						className="h-6 text-[11px]"
					>
						Open Plans
					</Button>
				</div>
			)}
		</div>
	);
}
