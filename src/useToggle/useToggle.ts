import { useCallback, useState } from "react";
import type { UseToggleReturn } from "./types.ts";

export function useToggle<T>(
	defaultValue: T,
	alternativeValue: T,
): UseToggleReturn<T> {
	const [value, setValue] = useState<T>(defaultValue);

	const toggle: () => void = useCallback((): void => {
		setValue((prev) =>
			prev === defaultValue ? alternativeValue : defaultValue,
		);
	}, [defaultValue, alternativeValue]);

	const set: (val: T) => void = useCallback((val: T): void => {
		setValue(val);
	}, []);

	return { value, toggle, set };
}
