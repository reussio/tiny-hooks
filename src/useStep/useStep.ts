import { useCallback, useState } from "react";
import type { UseStepOptions, UseStepReturn } from "./types.ts";

export function useStep(
	initialStep = 0,
	options: UseStepOptions = {},
): UseStepReturn {
	const { minStep = 0, maxStep = 0 } = options;

	const [step, setStepState] = useState(() => {
		if (initialStep < minStep) return minStep;
		if (initialStep > maxStep) return maxStep;
		return initialStep;
	});

	const setStep = useCallback(
		(newStep: number) => {
			if (newStep < minStep) setStepState(minStep);
			else if (newStep > maxStep) setStepState(maxStep);
			else setStepState(newStep);
		},
		[minStep, maxStep],
	);

	const next = useCallback(() => {
		setStepState((prev) => (prev < maxStep ? prev + 1 : prev));
	}, [maxStep]);

	const prev = useCallback(() => {
		setStepState((prev) => (prev > minStep ? prev - 1 : prev));
	}, [minStep]);

	const skip = useCallback(
		(amount: number) => {
			setStepState((prev) => {
				let newStep = prev + amount;
				if (newStep < minStep) newStep = minStep;
				if (newStep > maxStep) newStep = maxStep;
				return newStep;
			});
		},
		[minStep, maxStep],
	);

	const reset = useCallback(() => {
		setStepState(initialStep);
	}, [initialStep]);

	return { step, next, prev, skip, setStep, reset };
}
