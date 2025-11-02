export type UseCounterOptions = {
	initialValue?: number;
	options?: {
		min?: number;
		max?: number;
	};
};

export type UseCounterReturn = {
	count: number;
	inc: (step?: number) => void;
	dec: (step?: number) => void;
	set: (value: number) => void;
	reset: () => void;
};
