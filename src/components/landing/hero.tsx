import { Grainient } from "@/components/ui/grainient";
import { APP_INFO } from "@/constants/app-info";

const BRAND_GRAINIENT_COLORS = ["#120f17", "#2a0f0a", "#9a3412", "#f97316", "#fed7aa"];

export function Hero() {
	return (
		<section
			onContextMenu={(e) => e.preventDefault()}
			className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-20 sm:px-6"
		>
			{/* Entire Hero Background is Grainient */}
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

			{/* Smooth bottom blend into the next section */}
			<div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-36 bg-linear-to-t from-background to-transparent" />

			{/* Centered Content: [Logo] -> [Title] -> [Description] -> [CTA] */}
			<div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
				{/* [Logo]: Clean tilted app icon without card container */}
				<img
					src="/icons/512.png"
					alt={APP_INFO.name}
					draggable={false}
					className="size-32 rotate-[-8deg] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.55)] select-none sm:size-40"
				/>

				{/* [Title]: App Name with clean, high-impact display typography */}
				<h1 className="mt-8 text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-6xl md:text-7xl md:leading-[1.1]">
					{APP_INFO.name}
				</h1>

				{/* [Description]: Refined & purposeful copywriting */}
				<p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
					A free, open-source extension to stack up to 24 months of Google One 5TB AI Pro for $0.00,
					with real-time checkout protection.
				</p>

				{/* [CTA]: White Keeby-style tactile button without icon */}
				<div className="mt-9 flex items-center justify-center">
					<a
						href={APP_INFO.releaseZipUrl}
						target="_blank"
						rel="noreferrer noopener"
						className="group relative cursor-pointer overflow-hidden rounded-full border border-white/60 bg-linear-to-b from-white via-[#fafafa] to-[#e8e8e8] px-10 py-4 text-[16px] font-semibold text-neutral-900 shadow-[0_12px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,1)] transition-all duration-300 ease-out hover:from-white hover:to-[#f2f2f2] hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] active:scale-[0.98] sm:px-11 sm:py-4.5 sm:text-[17px]"
					>
						Download Extension
					</a>
				</div>
			</div>
		</section>
	);
}
