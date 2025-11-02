import type { RefCallback } from "react";

export interface UseHoverReturn<T extends HTMLElement = HTMLElement> {
	ref: RefCallback<T>;
	isHovered: boolean;
}
