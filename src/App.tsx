import { useState, useEffect } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { StackingVisualizer } from "@/components/landing/stacking-visualizer";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { WorkflowSteps } from "@/components/landing/workflow-steps";
import { InstallGuide } from "@/components/landing/install-guide";
import { FaqSection } from "@/components/landing/faq-section";
import { Footer } from "@/components/landing/footer";

export function App() {
	const [isDark, setIsDark] = useState(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("gapt_theme");
			if (saved) return saved === "dark";
			return window.matchMedia("(prefers-color-scheme: dark)").matches;
		}
		return false;
	});

	useEffect(() => {
		const root = document.documentElement;
		if (isDark) {
			root.classList.add("dark");
			localStorage.setItem("gapt_theme", "dark");
		} else {
			root.classList.remove("dark");
			localStorage.setItem("gapt_theme", "light");
		}
	}, [isDark]);

	const toggleTheme = () => setIsDark((prev) => !prev);

	return (
		<div className="min-h-screen bg-background text-foreground transition-colors duration-200">
			<Navbar isDark={isDark} onToggleTheme={toggleTheme} />
			<main>
				<Hero />
				<StackingVisualizer />
				<FeaturesGrid />
				<WorkflowSteps />
				<InstallGuide />
				<FaqSection />
			</main>
			<Footer />
		</div>
	);
}

export default App;
