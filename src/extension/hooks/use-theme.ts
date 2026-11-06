import { useState, useEffect } from "react";

export function useTheme() {
	const [isDark, setIsDark] = useState(() => {
		if (
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
		) {
			return true;
		}
		return false;
	});

	useEffect(() => {
		document.documentElement.classList.toggle("dark", isDark);
	}, [isDark]);

	useEffect(() => {
		if (typeof chrome !== "undefined" && chrome.storage) {
			chrome.storage.local.get(["gapt_theme"], (res) => {
				if (res?.gapt_theme) {
					setIsDark(res.gapt_theme === "dark");
				}
			});
		}
	}, []);

	const toggleTheme = () => {
		setIsDark((prev) => {
			const next = !prev;
			if (typeof chrome !== "undefined" && chrome.storage) {
				chrome.storage.local.set({ gapt_theme: next ? "dark" : "light" });
			}
			return next;
		});
	};

	return { isDark, toggleTheme };
}
