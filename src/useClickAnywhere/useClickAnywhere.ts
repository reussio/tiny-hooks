import { useEffect } from "react";
import type { UseClickAnywhereOptions } from "./types.ts";

export function useClickAnywhere(
	onClick: () => void,
	options: UseClickAnywhereOptions = {},
) {
	const { eventType = "mousedown" } = options;

	useEffect(() => {
		if (typeof document === "undefined" || typeof onClick !== "function")
			return;

		document.addEventListener(eventType, onClick);

		return () => {
			document.removeEventListener(eventType, onClick);
		};
	}, [onClick, eventType]);
}
