import { FaqSection } from "@/components/landing/faq-section";
import { FloatingNavbar } from "@/components/landing/floating-navbar";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { InstallSection } from "@/components/landing/install-section";
import { PreviewSection } from "@/components/landing/preview-section";
import { StackingSection } from "@/components/landing/stacking-section";

export function App() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<FloatingNavbar />
			<main>
				<Hero />
				<PreviewSection />
				<StackingSection />
				<InstallSection />
				<FaqSection />
			</main>
			<Footer />
		</div>
	);
}

export default App;
