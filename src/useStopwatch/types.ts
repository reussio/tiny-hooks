export interface UseStopwatchOptions {
	autoStart?: boolean;
	interval?: number;
}

export interface UseStopwatchReturn {
	time: number;
	start: () => void;
	stop: () => void;
	reset: () => void;
	isRunning: boolean;
}
