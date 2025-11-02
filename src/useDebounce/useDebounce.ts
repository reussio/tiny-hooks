import { useEffect, useRef, useState } from "react";
import type { UseDebounceOptions } from "./types.ts";

export function useDebounce<T>(value: T, options: UseDebounceOptions = {}): T {
	const { delay = 300, leading = false } = options;

	const [debouncedValue, setDebouncedValue] = useState<T>(value);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const lastValueRef = useRef<T>(value);

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		const shouldCallImmediately = leading && value !== lastValueRef.current;

		if (shouldCallImmediately) {
			setDebouncedValue(value);
		}

		timeoutRef.current = setTimeout(() => {
			if (!leading) {
				setDebouncedValue(value);
			}
			lastValueRef.current = value;
		}, delay);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [value, delay, leading]);

	return debouncedValue;
}
