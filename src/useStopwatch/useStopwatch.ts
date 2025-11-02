import { useCallback, useEffect, useRef, useState } from "react";
import type { UseStopwatchOptions, UseStopwatchReturn } from "./types.ts";

export function useStopwatch(
	options: UseStopwatchOptions = {},
): UseStopwatchReturn {
	const { autoStart = false, interval = 1000 } = options;
	const [time, setTime] = useState(0);
	const [isRunning, setIsRunning] = useState(autoStart);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const start = useCallback(() => {
		if (!isRunning) {
			setIsRunning(true);
		}
	}, [isRunning]);

	const stop = useCallback(() => {
		setIsRunning(false);
	}, []);

	const reset = useCallback(() => {
		setTime(0);
	}, []);

	useEffect(() => {
		if (isRunning) {
			timerRef.current = setInterval(() => {
				setTime((prev) => prev + interval);
			}, interval);
		} else if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [isRunning, interval]);

	return { time, start, stop, reset, isRunning };
}
