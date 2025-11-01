export interface UseStepOptions {
	minStep?: number;
	maxStep?: number;
}

export interface UseStepReturn {
	step: number;
	next: () => void;
	prev: () => void;
	skip: (amount: number) => void;
	setStep: (step: number) => void;
	reset: () => void;
}
