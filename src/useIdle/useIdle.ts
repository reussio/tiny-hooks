import { useCallback, useEffect, useRef, useState } from "react";
import type { UseIdleOptions, UseIdleReturn } from "./types.ts";

const defaultEvents = [
	"mousemove",
	"mousedown",
	"keydown",
	"scroll",
	"touchstart",
	"touchmove",
];

export function useIdle({
	timeout = 300_000, // 5 minutes
	onIdle,
	events = defaultEvents,
}: UseIdleOptions = {}): UseIdleReturn {
	const [isIdle, setIsIdle] = useState(false);
	const [lastActive, setLastActive] = useState(Date.now());
	const timer = useRef<number | null>(null);

	const resetTimer = useCallback(() => {
		if (timer.current) clearTimeout(timer.current);

		setIsIdle(false);
		setLastActive(Date.now());

		timer.current = window.setTimeout(() => {
			setIsIdle(true);
			onIdle?.();
		}, timeout);
	}, [timeout, onIdle]);

	useEffect(() => {
		events.forEach((event) => {
			window.addEventListener(event, resetTimer, true);
		});

		resetTimer();

		return () => {
			if (timer.current) clearTimeout(timer.current);
			events.forEach((event) => {
				window.removeEventListener(event, resetTimer, true);
			});
		};
	}, [resetTimer, events]);

	const idleTime = Date.now() - lastActive;

	return { isIdle, idleTime };
}
