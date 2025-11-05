import { useEffect, useState } from "react";
import type { ConnectionInfo } from "./types.ts";

export function useConnectionType(): ConnectionInfo {
	const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
		supported: true,
	});

	useEffect(() => {
		// biome-ignore lint/suspicious/noExplicitAny: TS is dumb
		const nav = navigator as any;
		const connection =
			nav.connection || nav.mozConnection || nav.webkitConnection;

		if (!connection) {
			setConnectionInfo({ supported: false });
			return;
		}

		const calculateSpeedCategory = (rtt?: number, downlink?: number) => {
			if (!rtt || !downlink) return "medium";
			if (rtt > 300 || downlink < 1.5) return "slow";
			if (rtt > 100 || downlink < 5) return "medium";
			return "fast";
		};

		const updateConnection = () => {
			setConnectionInfo({
				supported: true,
				type: connection.type,
				effectiveType: connection.effectiveType,
				downlink: connection.downlink,
				rtt: connection.rtt,
				saveData: connection.saveData,
				speedCategory: calculateSpeedCategory(
					connection.rtt,
					connection.downlink,
				),
			});
		};

		updateConnection();

		connection.addEventListener("change", updateConnection);
		return () => connection.removeEventListener("change", updateConnection);
	}, []);

	return connectionInfo;
}
