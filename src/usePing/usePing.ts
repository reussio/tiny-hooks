import { useCallback, useEffect, useRef, useState } from "react";
import type { UsePingOptions, UsePingReturn } from "./types.ts";

export function usePing(
	url: string,
	options: UsePingOptions = {},
): UsePingReturn {
	const {
		interval = 5000,
		timeout = 5000,
		enabled = true,
		onPing,
		averageOver,
	} = options;

	const [ping, setPing] = useState<number | null>(null);
	const [averagePing, setAveragePing] = useState<number | null>(null);
	const [lastSuccess, setLastSuccess] = useState<Date | null>(null);
	const [error, setError] = useState<string | null>(null);

	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const activeRef = useRef(enabled);
	const historyRef = useRef<number[]>([]);

	const calculateAverage = (arr: number[]) =>
		arr.length === 0 ? null : arr.reduce((a, b) => a + b, 0) / arr.length;

	//biome-ignore lint/correctness/useExhaustiveDependencies: calculateAverage shouldn't be used as dep
	const pingOnce = useCallback(async (): Promise<number | null> => {
		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), timeout);

		const startTime = performance.now();
		try {
			await fetch(url, {
				method: "HEAD",
				signal: controller.signal,
				cache: "no-store",
			});
			const duration = performance.now() - startTime;

			setPing(duration);

			if (averageOver && averageOver > 1) {
				historyRef.current.push(duration);
				if (historyRef.current.length > averageOver) {
					historyRef.current.shift();
				}
				setAveragePing(calculateAverage(historyRef.current));
			} else {
				setAveragePing(duration);
			}

			setLastSuccess(new Date());
			setError(null);
			onPing?.(duration);
			return duration;
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));
			setPing(null);
			setAveragePing(null);
			setError(error.name === "AbortError" ? "Timeout" : error.message);
			onPing?.(null);
			return null;
		} finally {
			clearTimeout(id);
		}
	}, [url, timeout, onPing, averageOver]);

	const start = useCallback(() => {
		activeRef.current = true;
		pingOnce();
		if (timerRef.current) clearInterval(timerRef.current);
		timerRef.current = setInterval(() => {
			if (activeRef.current) {
				pingOnce();
			}
		}, interval);
	}, [interval, pingOnce]);

	const stop = useCallback(() => {
		activeRef.current = false;
		if (timerRef.current) clearInterval(timerRef.current);
		timerRef.current = null;
	}, []);

	useEffect(() => {
		if (enabled) start();
		return () => stop();
	}, [enabled, start, stop]);

	return { ping, averagePing, lastSuccess, error, pingOnce, start, stop };
}
