import { Grainient } from "@/components/ui/grainient";
import { APP_INFO } from "@/constants/app-info";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

const BRAND_GRAINIENT_COLORS = ["#120f17", "#2a0f0a", "#9a3412", "#f97316", "#fed7aa"];

interface NotFoundPageProps {
	onNavigateHome: () => void;
}

export function NotFoundPage({ onNavigateHome }: NotFoundPageProps) {
	// Dynamically update document title and robots meta for 404 state
	useEffect(() => {
		const originalTitle = document.title;
		document.title = `404: Page Not Found — ${APP_INFO.name}`;

		let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
		const originalRobots = robotsMeta?.getAttribute("content") || "index, follow";

		if (robotsMeta) {
			robotsMeta.setAttribute("content", "noindex, nofollow");
		} else {
			robotsMeta = document.createElement("meta");
			robotsMeta.name = "robots";
			robotsMeta.content = "noindex, nofollow";
			document.head.appendChild(robotsMeta);
		}

		window.scrollTo({ top: 0, behavior: "smooth" });

		return () => {
			document.title = originalTitle;
			if (robotsMeta) {
				robotsMeta.setAttribute("content", originalRobots);
			}
		};
	}, []);

	return (
		<section
			onContextMenu={(e) => e.preventDefault()}
			className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-20 sm:px-6"
		>
			{/* Atmospheric Grainient WebGL Background */}
			<div className="pointer-events-auto absolute inset-0 z-0">
				<Grainient
					colors={BRAND_GRAINIENT_COLORS}
					angle={0}
					bands={1}
					speed={1}
					flow={0.85}
					scale={1}
					softness={1}
					silk={0.35}
					grainAmount={0.08}
					grainSize={1.2}
					grainAnimated={true}
					interactive={true}
					stir={1}
					clickSwirl={false}
					intro={true}
				/>
			</div>

			{/* Smooth bottom blend matching hero section styling */}
			<div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-36 bg-linear-to-t from-background to-transparent" />

			{/* Centered Content: [404 Title] -> [Description] -> [CTA] -> [Repo Link] */}
			<div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
				{/* 404 Title with display typography */}
				<h1 className="text-7xl font-extrabold tracking-[-0.04em] text-white sm:text-8xl md:text-9xl md:leading-[1.05]">
					404
				</h1>

				{/* Short & user-friendly generic description */}
				<p className="mt-4 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
					Sorry, the page you're looking for doesn't exist or has been moved.
				</p>

				{/* Actions matching hero layout: Tactile white button + subtle ghost repository link */}
				<div className="mt-9 flex flex-col items-center">
					<button
						type="button"
						onClick={onNavigateHome}
						title="Return to Homepage"
						className="group relative cursor-pointer overflow-hidden rounded-full border border-white/60 bg-linear-to-b from-white via-[#fafafa] to-[#e8e8e8] px-10 py-4 text-[16px] font-semibold text-neutral-900 shadow-[0_12px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,1)] transition-all duration-300 ease-out hover:from-white hover:to-[#f2f2f2] hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] active:scale-[0.98] sm:px-11 sm:py-4.5 sm:text-[17px]"
					>
						Return to Homepage
					</button>

					<a
						href={APP_INFO.githubUrl}
						target="_blank"
						rel="noreferrer noopener"
						title="View repository on GitHub"
						className="group mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-white/50 transition-colors duration-200 hover:text-white/90 sm:text-[13px]"
					>
						<span>Open source on GitHub</span>
						<ArrowRight
							className="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
							aria-hidden="true"
						/>
					</a>
				</div>
			</div>
		</section>
	);
}
