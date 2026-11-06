import { useEffect } from "react";

export function useTheme() {
	useEffect(() => {
		document.documentElement.classList.add("dark");
		document.documentElement.style.colorScheme = "dark";
	}, []);

	return { isDark: true };
}
