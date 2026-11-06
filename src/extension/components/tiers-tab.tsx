import { Badge } from "@/components/ui/badge";
import { OFFER_TIER_LIST, type OfferTierConfig, type OfferTierId } from "@/constants/offers";
import { ShieldCheck } from "lucide-react";

interface TiersTabProps {
	selectedLayer: OfferTierId;
	onSelectLayer: (layer: OfferTierId) => void;
}

interface TierCardProps {
	tier: OfferTierConfig;
	isSelected: boolean;
	onSelect: () => void;
}

function TierCard({ tier, isSelected, onSelect }: TierCardProps) {
	return (
		<button
			type="button"
			role="radio"
			aria-checked={isSelected}
			onClick={onSelect}
			className={`group flex w-full items-start justify-between rounded-lg border p-2.5 text-left transition-all ${
				isSelected
					? "border-primary bg-primary/5 shadow-xs"
					: "border-border/60 bg-card hover:border-border hover:bg-muted/30"
			}`}
		>
			<div className="flex w-full items-start gap-2.5">
				{/* Perfect circular radio button */}
				<div
					className={`mt-0.5 flex size-4 shrink-0 aspect-square items-center justify-center rounded-full border transition-all ${
						isSelected
							? "border-primary bg-primary text-primary-foreground"
							: "border-muted-foreground/40 group-hover:border-muted-foreground"
					}`}
				>
					{isSelected && <div className="size-1.5 shrink-0 rounded-full bg-primary-foreground" />}
				</div>

				{/* Tier metadata */}
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-1.5 flex-wrap">
						<span className="text-xs font-semibold text-foreground">{tier.name}</span>
						<Badge variant={tier.tagVariant} className="px-1.5 py-0 text-[10px]">
							{tier.tag}
						</Badge>
					</div>
					<p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
						{tier.description}
					</p>
				</div>
			</div>
		</button>
	);
}

export function TiersTab({ selectedLayer, onSelectLayer }: TiersTabProps) {
	return (
		<div className="space-y-2 p-3">
			<div className="text-[11px] font-medium text-muted-foreground">
				Select Subscription Tier:
			</div>

			<div className="space-y-1.5" role="radiogroup" aria-label="Subscription Tiers">
				{OFFER_TIER_LIST.map((tier) => (
					<TierCard
						key={tier.id}
						tier={tier}
						isSelected={selectedLayer === tier.id}
						onSelect={() => onSelectLayer(tier.id)}
					/>
				))}
			</div>

			<div className="mt-2 flex items-center justify-between rounded-md border border-border/40 bg-muted/20 px-2.5 py-2 text-[11px] text-muted-foreground">
				<span className="flex items-center gap-1.5">
					<ShieldCheck className="size-3.5 text-emerald-600" />
					Checkout Guard Active
				</span>
				<span className="text-[10px]">Auto $0.00 verification</span>
			</div>
		</div>
	);
}

