import { useEffect } from "react";
import { assertClient } from "../utils/assertClient.ts";
import type { UseClickAnywhereOptions } from "./types.ts";

export function useClickAnywhere(
	onClick: () => void,
	options: UseClickAnywhereOptions = {},
) {
	assertClient();

	const { eventType = "mousedown" } = options;

	useEffect(() => {
		document.addEventListener(eventType, onClick);

		return () => {
			document.removeEventListener(eventType, onClick);
		};
	}, [onClick, eventType]);
}
