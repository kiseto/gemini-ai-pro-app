import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DEFAULT_OFFER_TOKENS, type OfferTierId } from "@/constants/offers";
import type { CustomTokensMap } from "../types";
import { Eye, EyeOff, Copy, Check, Info, RotateCcw } from "lucide-react";

interface TokensTabProps {
	customTokens: CustomTokensMap;
	settingsSaved: boolean;
	disabled?: boolean;
	onTokenChange: (key: Exclude<OfferTierId, "off">, value: string) => void;
	onSave: () => void;
	onReset: () => void;
}

interface TokenFieldConfig {
	key: Exclude<OfferTierId, "off">;
	label: string;
}

const TOKEN_FIELDS: TokenFieldConfig[] = [
	{ key: "12m", label: "Tier 1 (12 Months) Token" },
	{ key: "6m_ss", label: "Tier 2 (6 Months Stack 1) Token" },
	{ key: "6m", label: "Tier 3 (6 Months Stack 2) Token" },
	{ key: "6m_2", label: "Tier 4 (6 Months Backup) Token" },
];

export function TokensTab({
	customTokens,
	settingsSaved,
	disabled = false,
	onTokenChange,
	onSave,
	onReset,
}: TokensTabProps) {
	const [showTokens, setShowTokens] = useState(false);
	const [copiedKey, setCopiedKey] = useState<string | null>(null);

	const handleCopyToken = (key: string, value: string) => {
		navigator.clipboard.writeText(value);
		setCopiedKey(key);
		setTimeout(() => setCopiedKey(null), 1500);
	};

	return (
		<div className="space-y-3 p-3 text-xs">
			<div className="flex items-center justify-between">
				<div>
					<div className="flex items-center gap-1.5">
						<h3 className="font-semibold text-foreground">Promotional Tokens</h3>
						{disabled && (
							<span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
								(Read Only)
							</span>
						)}
					</div>
					<p className="mt-0.5 text-[11px] text-muted-foreground">
						Tokens loaded from environment. Override or inspect below.
					</p>
				</div>
				<Button
					variant="ghost"
					size="icon-xs"
					onClick={() => setShowTokens((prev) => !prev)}
					title={showTokens ? "Mask tokens" : "Show tokens"}
				>
					{showTokens ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
				</Button>
			</div>

			{settingsSaved && (
				<div className="rounded-md bg-emerald-500/10 p-2 text-[11px] text-emerald-600 dark:text-emerald-400">
					✓ Configuration saved successfully
				</div>
			)}

			<div className="space-y-2">
				{TOKEN_FIELDS.map(({ key, label }) => {
					const value = customTokens[key] || DEFAULT_OFFER_TOKENS[key];
					const isCopied = copiedKey === key;
					return (
						<div key={key}>
							<div className="flex items-center justify-between">
								<label className="text-[10px] font-semibold text-muted-foreground uppercase">
									{label}
								</label>
								<button
									type="button"
									onClick={() => handleCopyToken(key, value)}
									className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
									title="Copy token"
								>
									{isCopied ? (
										<>
											<Check className="size-3 text-emerald-500" /> Copied
										</>
									) : (
										<>
											<Copy className="size-3" /> Copy
										</>
									)}
								</button>
							</div>
							<input
								type={showTokens ? "text" : "password"}
								value={value}
								disabled={disabled}
								onChange={(e) => onTokenChange(key, e.target.value.trim())}
								className="mt-1 w-full rounded-md border border-border bg-card px-2 py-1 font-mono text-[10px] text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
							/>
						</div>
					);
				})}
			</div>

			<div className="flex items-start gap-1.5 rounded-md bg-muted/40 p-2 text-[11px] text-muted-foreground">
				<Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
				<span>Tokens are securely used by the MAIN-world injector during checkout.</span>
			</div>

			<div className="flex gap-2 pt-1">
				<Button size="xs" onClick={onSave} disabled={disabled} className="flex-1 text-xs">
					Save Overrides
				</Button>
				<Button
					variant="outline"
					size="xs"
					onClick={onReset}
					disabled={disabled}
					className="text-xs"
					title="Reset to environment defaults"
				>
					<RotateCcw className="mr-1 size-3" />
					Reset
				</Button>
			</div>
		</div>
	);
}

