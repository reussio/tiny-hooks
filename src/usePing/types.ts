export interface UsePingOptions {
	interval?: number;
	timeout?: number;
	enabled?: boolean;
	onPing?: (ms: number | null) => void;
	averageOver?: number;
}

export interface UsePingReturn {
	ping: number | null;
	averagePing: number | null;
	lastSuccess: Date | null;
	error: string | null;
	pingOnce: () => Promise<number | null>;
	start: () => void;
	stop: () => void;
}
