import { useCallback, useMemo } from "react";
import type { UseRedirectReturn } from "./types.ts";

export function useRedirect(fallback: string = "/"): UseRedirectReturn {
	const redirectUrl = useMemo(() => {
		const params = new URLSearchParams(window.location.search);
		return params.get("redirect") || fallback;
	}, [fallback]);

	const redirect = useCallback(() => {
		window.location.href = redirectUrl;
	}, [redirectUrl]);

	const redirectTo = useCallback((url: string) => {
		window.location.href = url;
	}, []);

	return { redirect, redirectTo, redirectUrl };
}
