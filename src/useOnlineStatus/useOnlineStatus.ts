import { useEffect, useState } from "react";
import { assertClient } from "../utils/assertClient.ts";

export function useOnlineStatus(): boolean {
	assertClient();

	const [online, setOnline] = useState<boolean>(navigator.onLine);

	useEffect(() => {
		const goOnline = () => setOnline(true);
		const goOffline = () => setOnline(false);

		window.addEventListener("online", goOnline);
		window.addEventListener("offline", goOffline);

		return () => {
			window.removeEventListener("online", goOnline);
			window.removeEventListener("offline", goOffline);
		};
	}, []);

	return online;
}
