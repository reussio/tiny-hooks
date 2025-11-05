import { useEffect, useState } from "react";
import { assertClient } from "../utils/assertClient.ts";
import type { BatteryStatus } from "./types.ts";

export function useBatteryStatus(): BatteryStatus {
	assertClient();
	const [battery, setBattery] = useState<BatteryStatus>({
		supported: true,
		charging: undefined,
		level: undefined,
		chargingTime: undefined,
		dischargingTime: undefined,
	});

	useEffect(() => {
		// biome-ignore lint/suspicious/noExplicitAny: TS ist dumb
		let batteryManager: any;

		const handleChange = () => {
			if (batteryManager) {
				setBattery({
					supported: true,
					charging: batteryManager.charging,
					level: batteryManager.level,
					chargingTime: batteryManager.chargingTime,
					dischargingTime: batteryManager.dischargingTime,
				});
			}
		};

		const setup = async () => {
			try {
				// biome-ignore lint/suspicious/noExplicitAny: TS ist dumb
				const nav = navigator as any;
				if (typeof nav.getBattery !== "function") {
					setBattery({ supported: false });
					return;
				}

				batteryManager = await nav.getBattery();
				handleChange();

				batteryManager.addEventListener("chargingchange", handleChange);
				batteryManager.addEventListener("levelchange", handleChange);
				batteryManager.addEventListener("chargingtimechange", handleChange);
				batteryManager.addEventListener("dischargingtimechange", handleChange);
			} catch {
				setBattery({ supported: false });
			}
		};

		setup();

		return () => {
			if (batteryManager) {
				batteryManager.removeEventListener("chargingchange", handleChange);
				batteryManager.removeEventListener("levelchange", handleChange);
				batteryManager.removeEventListener("chargingtimechange", handleChange);
				batteryManager.removeEventListener(
					"dischargingtimechange",
					handleChange,
				);
			}
		};
	}, []);

	return battery;
}
