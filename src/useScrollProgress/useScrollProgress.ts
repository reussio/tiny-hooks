import { useCallback, useEffect, useState } from "react";
import { useThrottle } from "../useThrottle";
import type { UseScrollProgressOptions } from "./types.ts";

export function useScrollProgress<T extends HTMLElement = HTMLElement>(
	options: UseScrollProgressOptions<T> = {},
): number {
	const { percent = false, ref, throttle = 0 } = options;
	const [progress, setProgress] = useState(0);

	const calculateProgress = useCallback(() => {
		const target = ref?.current || window;

		let scrollTop: number, scrollHeight: number, clientHeight: number;

		if (target === window) {
			scrollTop = window.scrollY || window.pageYOffset;
			scrollHeight = document.documentElement.scrollHeight;
			clientHeight = window.innerHeight;
		} else if (target instanceof HTMLElement) {
			scrollTop = target.scrollTop;
			scrollHeight = target.scrollHeight;
			clientHeight = target.clientHeight;
		} else {
			return 0;
		}

		const totalScroll = scrollHeight - clientHeight;
		if (totalScroll <= 0) return 0;

		let currentProgress = scrollTop / totalScroll;
		if (percent) currentProgress = currentProgress * 100;

		return currentProgress;
	}, [percent, ref]);

	const throttledValue = useThrottle(calculateProgress(), throttle || 0);

	useEffect(() => {
		const target = ref?.current || window;

		const handleScroll = () => {
			setProgress(throttledValue);
		};

		handleScroll();

		target.addEventListener("scroll", handleScroll);
		return () => target.removeEventListener("scroll", handleScroll);
	}, [throttledValue, ref]);

	return progress;
}
