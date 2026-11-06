import { useEffect } from "react";
import { FloatingNavbar } from "@/components/landing/floating-navbar";
import { Hero } from "@/components/landing/hero";
import { KeebyShowcase } from "@/components/landing/keeby-showcase";
import { StickyCardStack } from "@/components/landing/sticky-card-stack";
import { InstallGuide } from "@/components/landing/install-guide";
import { FaqSection } from "@/components/landing/faq-section";
import { Footer } from "@/components/landing/footer";

export function App() {
	useEffect(() => {
		document.documentElement.classList.add("dark");
	}, []);

	return (
		<div className="min-h-screen bg-background text-foreground">
			<FloatingNavbar />
			<main>
				<Hero />
				<KeebyShowcase />
				<StickyCardStack />
				<InstallGuide />
				<FaqSection />
			</main>
			<Footer />
		</div>
	);
}

export default App;
