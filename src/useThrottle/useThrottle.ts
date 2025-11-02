import { useEffect, useRef, useState } from "react";
import type { UseThrottleOptions } from "./types.ts";

export function useThrottle<T>(
	value: T,
	limit: number,
	options: UseThrottleOptions = {},
): T {
	const { leading = true, trailing = true } = options;

	const [throttledValue, setThrottledValue] = useState<T>(value);
	const lastRan = useRef<number>(0);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const savedValue = useRef<T>(value);

	useEffect(() => {
		savedValue.current = value;

		const now = Date.now();
		const remaining = limit - (now - lastRan.current);

		if (remaining <= 0) {
			if (leading) {
				setThrottledValue(value);
				lastRan.current = now;
			}
		} else if (trailing) {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => {
				setThrottledValue(savedValue.current);
				lastRan.current = Date.now();
				timeoutRef.current = null;
			}, remaining);
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, [value, limit, leading, trailing]);

	return throttledValue;
}
