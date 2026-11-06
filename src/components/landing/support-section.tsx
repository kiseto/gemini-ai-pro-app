import { Heart, ArrowUpRight } from "lucide-react";
import { APP_INFO } from "@/constants/app-info";

interface SupportChannel {
	id: string;
	title: string;
	type: string;
	methods: string;
	qrImage: string;
	qrAlt: string;
	instruction: string;
	actionUrl?: string;
	actionLabel?: string;
}

const SUPPORT_CHANNELS: SupportChannel[] = [
	{
		id: "bmc",
		title: "Buy Me a Coffee",
		type: "Global / International",
		methods: "Cards · Apple Pay · Google Pay",
		qrImage: "/images/qrcode-bmc.png",
		qrAlt: "Buy Me a Coffee QR Code",
		instruction: "Scan with camera or click below",
		actionUrl: APP_INFO.bmcUrl,
		actionLabel: "Open buymeacoffee.com",
	},
	{
		id: "gcash",
		title: "GCash / QR Ph",
		type: "Direct Instant Transfer",
		methods: "GCash · Maya · InstaPay Banking",
		qrImage: "/images/qrcode-gcash.jpg",
		qrAlt: "GCash / QR Ph QR Code",
		instruction: "Scan with any PH banking app",
	},
];

export function SupportSection() {
	return (
		<section id="support" className="relative py-20 sm:py-28">
			<div className="container mx-auto max-w-6xl px-4 sm:px-6">
				{/* Unified Support Card Container */}
				<div className="mx-auto max-w-2xl rounded-2xl border border-border/80 bg-card/60 p-6 shadow-xl backdrop-blur-sm sm:p-10">
					{/* Header */}
					<div className="mx-auto max-w-lg text-center">
						<div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-mono text-xs font-semibold tracking-wider text-primary uppercase">
							<Heart className="size-3.5 fill-primary/20" />
							<span>Support Development</span>
						</div>

						<h2 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
							Support Independent Tooling
						</h2>

						<p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
							AI Pro Portal is an independent, open-source companion tool that runs 100% locally in
							your browser. Contributions toward ongoing maintenance, development, and documentation
							are always appreciated.
						</p>
					</div>

					{/* Payment Channels Grid */}
					<div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
						{SUPPORT_CHANNELS.map((channel) => (
							<div
								key={channel.id}
								className="flex flex-col items-center justify-between rounded-xl border border-border/80 bg-background/50 p-5 text-center transition-colors hover:border-border"
							>
								<div className="flex w-full flex-col items-center">
									{/* Channel Name */}
									<h3 className="text-sm font-bold text-foreground">{channel.title}</h3>
									<span className="mt-0.5 font-mono text-[11px] text-muted-foreground">
										{channel.methods}
									</span>

									{/* QR Code Frame */}
									<div className="mt-4 flex size-40 items-center justify-center rounded-xl border border-border/60 bg-white p-2.5 shadow-md">
										<img
											src={channel.qrImage}
											alt={channel.qrAlt}
											className="size-full object-contain"
											width="160"
											height="160"
											loading="lazy"
											decoding="async"
										/>
									</div>

									<span className="mt-3 font-mono text-[11px] text-muted-foreground">
										{channel.instruction}
									</span>
								</div>

								{/* Bottom Action */}
								{channel.actionUrl && (
									<div className="mt-4 w-full border-t border-border/60 pt-3">
										<a
											href={channel.actionUrl}
											target="_blank"
											rel="noreferrer noopener"
											className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/20 active:scale-98"
										>
											<span>{channel.actionLabel}</span>
											<ArrowUpRight className="size-3.5" />
										</a>
									</div>
								)}
							</div>
						))}
					</div>

					{/* Developer Attribution */}
					<div className="mt-8 flex flex-col items-center justify-between gap-3 pt-2 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
						<div>
							<span>Crafted by </span>
							<a
								href={APP_INFO.devGithub}
								target="_blank"
								rel="noreferrer noopener"
								className="font-medium text-primary hover:underline"
							>
								@nmrisrl11
							</a>
							<span className="mx-1.5 text-muted-foreground/60">&bull;</span>
							<a
								href={APP_INFO.devUrl}
								target="_blank"
								rel="noreferrer noopener"
								className="text-foreground/80 transition-colors hover:text-foreground"
							>
								nmrisrl.dev
							</a>
						</div>
						<span className="font-mono text-[11px] text-muted-foreground/70">
							Landing Page: MIT License &bull; Free Community Tool
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
