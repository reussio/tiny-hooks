export interface ConnectionInfo {
	supported: boolean;
	type?: string;
	effectiveType?: string;
	downlink?: number;
	rtt?: number;
	saveData?: boolean;
	speedCategory?: "slow" | "medium" | "fast";
}
