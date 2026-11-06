import { useState, useEffect, useRef } from "react";
import { FEATURE_FLAGS } from "@/constants/app-info";

export function useDeveloperMode() {
	const [isDevMode, setIsDevMode] = useState<boolean>(FEATURE_FLAGS.showTokensTab);
	const devClickCountRef = useRef(0);
	const devClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (typeof chrome !== "undefined" && chrome.storage) {
			chrome.storage.local.get(["gapt_dev_mode"], (res) => {
				if (typeof res?.gapt_dev_mode === "boolean") {
					setIsDevMode(res.gapt_dev_mode);
				}
			});
		}
	}, []);

	// Secret 5-tap sequence to toggle developer mode
	const handleVersionClick = () => {
		if (devClickTimerRef.current) {
			clearTimeout(devClickTimerRef.current);
		}

		devClickCountRef.current += 1;

		if (devClickCountRef.current >= 5) {
			devClickCountRef.current = 0;
			setIsDevMode((current) => {
				const next = !current;
				if (typeof chrome !== "undefined" && chrome.storage) {
					chrome.storage.local.set({ gapt_dev_mode: next });
				}
				return next;
			});
			return;
		}

		// Reset count if taps stop for more than 2 seconds
		devClickTimerRef.current = setTimeout(() => {
			devClickCountRef.current = 0;
		}, 2000);
	};

	return { isDevMode, handleVersionClick };
}
