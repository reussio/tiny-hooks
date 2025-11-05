export interface BatteryStatus {
	supported: boolean;
	charging?: boolean;
	level?: number;
	chargingTime?: number;
	dischargingTime?: number;
}
