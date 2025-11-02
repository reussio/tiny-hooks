import { useCallback, useState } from "react";
import type { UseCounterOptions, UseCounterReturn } from "./types.ts";

export function useCounter({
	initialValue = 0,
	options,
}: UseCounterOptions = {}): UseCounterReturn {
	const { min = -Infinity, max = Infinity } = options || {};
	const [count, setCount] = useState<number>(initialValue);

	const set = useCallback(
		(value: number): void => {
			setCount(Math.max(min, Math.min(max, value)));
		},
		[min, max],
	);

	const inc = useCallback(
		(step: number = 1) => {
			setCount((prev) => Math.min(prev + step, max));
		},
		[max],
	);

	const dec = useCallback(
		(step: number = 1) => {
			setCount((prev) => Math.max(prev - step, min));
		},
		[min],
	);

	const reset = useCallback(() => {
		setCount(initialValue);
	}, [initialValue]);

	return { count, inc, dec, set, reset };
}
