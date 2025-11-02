import { useEffect, useState } from "react";
import { useIsClient } from "../useIsClient";

export function useOnlineStatus(): boolean | undefined {
	const isClient = useIsClient();
	const [online, setOnline] = useState<boolean | undefined>(() => {
		return typeof navigator !== "undefined" && isClient
			? navigator.onLine
			: undefined;
	});

	useEffect(() => {
		if (!isClient) return;

		const goOnline = () => setOnline(true);
		const goOffline = () => setOnline(false);

		window.addEventListener("online", goOnline);
		window.addEventListener("offline", goOffline);

		return () => {
			window.removeEventListener("online", goOnline);
			window.removeEventListener("offline", goOffline);
		};
	}, [isClient]);

	return online;
}
