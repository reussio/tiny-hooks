import { useEffect, useState } from "react";
import { assertClient } from "../utils/assertClient.ts";
import type { BrowserCapabilities } from "./types.ts";

export function useBrowserCapabilities(): BrowserCapabilities {
	assertClient();
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
			clipboard: !!navigator.clipboard,
			geolocation: !!navigator.geolocation,
			localStorage: !!window.localStorage,
			sessionStorage: !!window.sessionStorage,
			notifications: !!window.Notification,
			serviceWorker: !!navigator.serviceWorker?.register,
			fetch: !!window.fetch,
			webSocket: !!window.WebSocket,
			fileReader: !!window.FileReader,
			online: "onLine" in navigator,
			mediaDevices: !!navigator.mediaDevices?.getUserMedia,
		});
	}, []);

	return capabilities;
}
