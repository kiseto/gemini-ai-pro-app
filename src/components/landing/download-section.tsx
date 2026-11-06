import { Grainient } from "@/components/ui/grainient";
import { APP_INFO } from "@/constants/app-info";

const BRAND_GRAINIENT_COLORS = ["#120f17", "#2a0f0a", "#9a3412", "#f97316", "#fed7aa"];

export function DownloadSection() {
	return (
		<section
			id="download"
			onContextMenu={(e) => e.preventDefault()}
			className="relative -mb-px flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-background px-4 pt-28 pb-36 sm:px-6 sm:pt-36 sm:pb-48"
		>
			{/* Atmospheric Grainient Background */}
			<div className="pointer-events-auto absolute inset-0 z-0">
				<Grainient
					colors={BRAND_GRAINIENT_COLORS}
					angle={180}
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
					intro={false}
				/>
			</div>

			{/* Smooth top blend transitioning from the Support section */}
			<div className="pointer-events-none absolute inset-x-0 -top-1 z-0 h-40 bg-linear-to-b from-background to-transparent sm:h-48" />

			{/* Smooth bottom blend dissolving into the Footer */}
			<div className="pointer-events-none absolute inset-x-0 -bottom-1 z-0 h-48 bg-linear-to-t from-background to-transparent sm:h-64" />

			{/* Centered Content: [Logo] -> [Headline] -> [Description] -> [CTA] -> [Proofline] */}
			<div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
				{/* Logo: Signature tilted app icon */}
				<img
					src="/icons/512.png"
					alt={APP_INFO.name}
					draggable={false}
					className="size-24 rotate-[-7deg] object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.55)] select-none sm:size-28"
				/>

				{/* Headline: High-impact display typography */}
				<h2 className="mt-7 text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl md:text-6xl md:leading-[1.15]">
					Ready to claim your 24 months?
				</h2>

				{/* Description */}
				<p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
					Free, open-source, and 100% client-side. Download the pre-compiled extension and start
					stacking your 5TB benefits in under 60 seconds.
				</p>

				{/* CTA Button: White tactile button matching hero */}
				<div className="mt-8 flex flex-col items-center gap-3.5">
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
