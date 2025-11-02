import { type RefObject, useEffect } from "react";
import { assertClient } from "../utils/assertClient.ts";
import type { UseClickOutsideOptions } from "./types.ts";

export function useClickOutside<T extends HTMLElement = HTMLElement>(
	ref: RefObject<T>,
	callback: () => void,
	options: UseClickOutsideOptions = {},
) {
	assertClient();

	const { eventType = ["mousedown", "touchstart"] } = options;

	useEffect(() => {
		const events = Array.isArray(eventType) ? eventType : [eventType];

		const handleClick = (event: MouseEvent | TouchEvent) => {
			if (ref.current?.contains(event.target as Node)) return;
			callback();
		};

		events.forEach((ev) => {
			document.addEventListener(ev, handleClick);
		});
		return () =>
			events.forEach((ev) => {
				document.removeEventListener(ev, handleClick);
			});
	}, [ref, callback, eventType]);
}
