import { useCallback, useRef, useState } from "react";
import { assertClient } from "../utils/assertClient.ts";
import type { UseHoverReturn } from "./types";

export function useHover<
	T extends HTMLElement = HTMLElement,
>(): UseHoverReturn<T> {
	assertClient();
	const [isHovered, setIsHovered] = useState(false);
	const nodeRef = useRef<T | null>(null);

	const onEnter = useCallback(() => setIsHovered(true), []);
	const onLeave = useCallback(() => setIsHovered(false), []);

	const ref = useCallback(
		(node: T | null) => {
			if (nodeRef.current) {
				nodeRef.current.removeEventListener("mouseenter", onEnter);
				nodeRef.current.removeEventListener("mouseleave", onLeave);
			}

			nodeRef.current = node;

			if (node) {
				node.addEventListener("mouseenter", onEnter);
				node.addEventListener("mouseleave", onLeave);
			}
		},
		[onEnter, onLeave],
	);

	return { ref, isHovered };
}
