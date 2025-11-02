import { useCallback, useEffect, useRef, useState } from "react";
import { assertClient } from "../utils/assertClient.ts";
import type { UseIsMountedReturn } from "./types.ts";

export function useIsMounted(): UseIsMountedReturn {
	assertClient();
	const [isMounted, setIsMounted] = useState(false);
	const isMountedRef = useRef(false);

	useEffect(() => {
		isMountedRef.current = true;
		setIsMounted(true);
		return () => {
			isMountedRef.current = false;
			setIsMounted(false);
		};
	}, []);

	const getIsMounted = useCallback(() => isMountedRef.current, []);

	return { isMounted, getIsMounted };
}
