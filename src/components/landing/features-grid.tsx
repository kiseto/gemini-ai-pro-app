import { ShieldAlert, Zap, Lock, Sliders, Smartphone, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FeaturesGrid() {
	const features = [
		{
			icon: ShieldAlert,
			title: "Play Checkout Safety Guard",
			desc: "Inspects Google Play checkout modals in real-time. Displays a prominent green verification banner for genuine $0.00 trials, or alerts in red if an immediate paid charge is detected.",
			badge: "Critical Protection",
			badgeVariant: "default" as const,
		},
		{
			icon: Zap,
			title: "Zero-Latency Interceptor",
			desc: "Clean monkey-patching of XMLHttpRequest and iframe navigation URLs on one.google.com ensures promotional protobuf payloads are swapped seamlessly without network lag.",
			badge: "In-Memory",
			badgeVariant: "secondary" as const,
		},
		{
			icon: Lock,
			title: "100% Client-Side & Private",
			desc: "Zero tracking, zero analytics, zero external servers. All operations occur strictly within your browser's local sandbox memory. No credentials or passwords ever leave your machine.",
			badge: "Zero-Telemetry",
			badgeVariant: "outline" as const,
		},
		{
			icon: Sliders,
			title: "Externalized Token Config",
			desc: "Clean separation of sensitive promotional tokens into environment variables (.env). Supports custom token overrides directly within the extension popup settings dialog.",
			badge: "Configurable",
			badgeVariant: "secondary" as const,
		},
		{
			icon: Smartphone,
			title: "On-Page Status Pill",
			desc: "A sleek, non-intrusive floating indicator in the bottom-right corner of Google One displays active mounting status, current tier, and stacking state at a glance.",
			badge: "Live Feedback",
			badgeVariant: "outline" as const,
		},
		{
			icon: Terminal,
			title: "Built with Vite & React 19",
			desc: "Engineered with strict TypeScript, Tailwind CSS v4, and Radix UI primitives. Fully typed extension messaging protocol and automated ZIP packaging scripts.",
			badge: "Modern Stack",
			badgeVariant: "default" as const,
		},
	];

	return (
		<section id="features" className="py-20">
			<div className="container mx-auto max-w-6xl px-4 sm:px-6">
				<div className="mx-auto max-w-2xl text-center">
					<Badge variant="outline" className="mb-3 px-3 py-1 text-xs">
						Engineered for Safety &amp; Reliability
					</Badge>
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Core Architecture &amp; Capabilities
					</h2>
					<p className="mt-3 text-muted-foreground sm:text-base">
						Built from the ground up to replace fragile, undocumented scripts with a robust,
						typesafe, and user-centric Chrome extension.
					</p>
				</div>

				<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{features.map((feature, idx) => {
						const Icon = feature.icon;
						return (
							<div
								key={idx}
								className="group relative flex flex-col justify-between rounded-xl border border-border/60 bg-card p-6 transition-all hover:border-border hover:shadow-md"
							>
								<div>
									<div className="flex items-center justify-between">
										<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
											<Icon className="size-5" />
										</div>
										<Badge variant={feature.badgeVariant} className="text-[10px]">
											{feature.badge}
										</Badge>
									</div>

									<h3 className="mt-4 text-base font-bold text-foreground">{feature.title}</h3>
									<p className="mt-2 text-xs leading-relaxed text-muted-foreground">
										{feature.desc}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
