import { useEffect, useState } from "react";
import type { BrowserCapabilities } from "./types.ts";

export function useBrowserCapabilities(): BrowserCapabilities {
	const [capabilities, setCapabilities] = useState<BrowserCapabilities>({
		clipboard: false,
		geolocation: false,
		localStorage: false,
		sessionStorage: false,
		notifications: false,
		serviceWorker: false,
		fetch: false,
		webSocket: false,
		fileReader: false,
		online: false,
		mediaDevices: false,
	});

	useEffect(() => {
		setCapabilities({
			clipboard: typeof navigator !== "undefined" && !!navigator.clipboard,
			geolocation: typeof navigator !== "undefined" && !!navigator.geolocation,
			localStorage: typeof window !== "undefined" && !!window.localStorage,
			sessionStorage: typeof window !== "undefined" && !!window.sessionStorage,
			notifications: typeof window !== "undefined" && !!window.Notification,
			serviceWorker:
				typeof navigator !== "undefined" && !!navigator.serviceWorker?.register,
			fetch: typeof window !== "undefined" && !!window.fetch,
			webSocket: typeof window !== "undefined" && !!window.WebSocket,
			fileReader: typeof window !== "undefined" && !!window.FileReader,
			online: typeof navigator !== "undefined" && "onLine" in navigator,
			mediaDevices:
				typeof navigator !== "undefined" &&
				!!navigator.mediaDevices?.getUserMedia,
		});
	}, []);

	return capabilities;
}
