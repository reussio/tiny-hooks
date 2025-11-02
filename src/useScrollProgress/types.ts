import type { RefObject } from "react";

export interface UseScrollProgressOptions<T extends HTMLElement = HTMLElement> {
	ref?: RefObject<T>;
	percent?: boolean;
	throttle?: number;
}
