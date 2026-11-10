import { DownloadSection } from "@/components/landing/download-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FloatingNavbar } from "@/components/landing/floating-navbar";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { InstallSection } from "@/components/landing/install-section";
import { NotFoundPage } from "@/components/landing/not-found-page";
import { PreviewSection } from "@/components/landing/preview-section";
import { StackingSection } from "@/components/landing/stacking-section";
import { SupportSection } from "@/components/landing/support-section";
import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";

function isNonExistentPath(): boolean {
	const rawPath = window.location.pathname.replace(/\/+$/, "") || "/";
	return rawPath !== "/" && rawPath !== "/index.html";
}

export function App() {
	const [isNotFound, setIsNotFound] = useState(isNonExistentPath);

	useEffect(() => {
		const handleLocationChange = () => {
			setIsNotFound(isNonExistentPath());
		};

		window.addEventListener("popstate", handleLocationChange);
		return () => window.removeEventListener("popstate", handleLocationChange);
	}, []);

	const handleNavigateHome = () => {
		window.history.pushState(null, "", "/");
		setIsNotFound(false);
	};

	if (isNotFound) {
		return (
			<>
				<NotFoundPage onNavigateHome={handleNavigateHome} />
				<Analytics />
			</>
		);
	}

	return (
		<div className="min-h-screen bg-background text-foreground">
			<FloatingNavbar />
			<main>
				<Hero />
				<PreviewSection />
				<StackingSection />
				<InstallSection />
				<FaqSection />
				<SupportSection />
				<DownloadSection />
			</main>
			<Footer />
			<Analytics />
		</div>
	);
}

export default App;
