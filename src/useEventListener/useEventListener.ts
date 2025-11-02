import { useEffect, useRef } from "react";
import { assertClient } from "../utils/assertClient.ts";

export function useEventListener<
	K extends keyof HTMLElementEventMap,
	T extends EventTarget = HTMLElement,
>(
	eventName: K,
	handler: (event: HTMLElementEventMap[K]) => void,
	target?: T,
	options?: boolean | AddEventListenerOptions,
): void {
	assertClient();
	const savedHandler = useRef(handler);

	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		const targetElement: EventTarget = target ?? window;

		const eventListener = (event: Event) => {
			savedHandler.current(event as HTMLElementEventMap[K]);
		};

		targetElement.addEventListener(eventName, eventListener, options);
		return () => {
			targetElement.removeEventListener(eventName, eventListener, options);
		};
	}, [eventName, target, options]);
}
