export interface UseIdleOptions {
	timeout?: number;
	onIdle?: () => void;
	events?: string[];
}

export interface UseIdleReturn {
	isIdle: boolean;
	idleTime: number;
}
