import { Badge } from "@/components/ui/badge";
import { OFFER_TIER_LIST, type OfferTierConfig, type OfferTierId } from "@/constants/offers";
import { ShieldCheck } from "lucide-react";

interface TiersTabProps {
	selectedLayer: OfferTierId;
	disabled?: boolean;
	onSelectLayer: (layer: OfferTierId) => void;
}

interface TierCardProps {
	tier: OfferTierConfig;
	isSelected: boolean;
	disabled?: boolean;
	onSelect: () => void;
}

function TierCard({ tier, isSelected, disabled = false, onSelect }: TierCardProps) {
	return (
		<button
			type="button"
			role="radio"
			aria-checked={isSelected}
			aria-disabled={disabled}
			disabled={disabled}
			onClick={disabled ? undefined : onSelect}
			className={`group flex w-full items-start justify-between rounded-lg border p-2.5 text-left transition-all ${
				disabled
					? "opacity-50 cursor-not-allowed bg-card/60 border-border/40"
					: isSelected
						? "border-primary bg-primary/5 shadow-xs cursor-pointer"
						: "border-border/60 bg-card hover:border-border hover:bg-muted/30 cursor-pointer"
			}`}
		>
			<div className="flex w-full items-start gap-2.5">
				{/* Perfect circular radio button */}
				<div
					className={`mt-0.5 flex size-4 shrink-0 aspect-square items-center justify-center rounded-full border transition-all ${
						disabled
							? isSelected
								? "border-primary/50 bg-primary/50 text-primary-foreground/50"
								: "border-muted-foreground/30 bg-muted/20"
							: isSelected
								? "border-primary bg-primary text-primary-foreground"
								: "border-muted-foreground/40 group-hover:border-muted-foreground"
					}`}
				>
					{isSelected && (
						<div
							className={`size-1.5 shrink-0 rounded-full ${
								disabled ? "bg-primary-foreground/60" : "bg-primary-foreground"
							}`}
						/>
					)}
				</div>

				{/* Tier metadata */}
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-1.5 flex-wrap">
						<span
							className={`text-xs font-semibold ${
								disabled ? "text-foreground/60" : "text-foreground"
							}`}
						>
							{tier.name}
						</span>
						<Badge
							variant={tier.tagVariant}
							className={`px-1.5 py-0 text-[10px] ${disabled ? "opacity-60" : ""}`}
						>
							{tier.tag}
						</Badge>
					</div>
					<p
						className={`mt-1 text-[11px] leading-relaxed ${
							disabled ? "text-muted-foreground/70" : "text-muted-foreground"
						}`}
					>
						{tier.description}
					</p>
				</div>
			</div>
		</button>
	);
}

export function TiersTab({ selectedLayer, disabled = false, onSelectLayer }: TiersTabProps) {
	return (
		<div className="space-y-2 p-3">
			<div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
				<span>Select Subscription Tier:</span>
				{disabled && (
					<span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
						Disabled on this site
					</span>
				)}
			</div>

			<div
				className="space-y-1.5"
				role="radiogroup"
				aria-label="Subscription Tiers"
				aria-disabled={disabled}
			>
				{OFFER_TIER_LIST.map((tier) => (
					<TierCard
						key={tier.id}
						tier={tier}
						isSelected={selectedLayer === tier.id}
						disabled={disabled}
						onSelect={() => onSelectLayer(tier.id)}
					/>
				))}
			</div>

			<div
				className={`mt-2 flex items-center justify-between rounded-md border border-border/40 bg-muted/20 px-2.5 py-2 text-[11px] text-muted-foreground ${
					disabled ? "opacity-60" : ""
				}`}
			>
				<span className="flex items-center gap-1.5">
					<ShieldCheck className="size-3.5 text-emerald-600" />
					Checkout Guard Active
				</span>
				<span className="text-[10px]">Auto $0.00 verification</span>
			</div>
		</div>
	);
}

