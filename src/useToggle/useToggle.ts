import { useCallback, useState } from "react";
import type { UseToggleReturn } from "./types.ts";

export function useToggle<T>(
	defaultValue: T,
	alternativeValue: T,
): UseToggleReturn<T> {
	const [value, setValue] = useState<T>(defaultValue);

	const toggle = useCallback(() => {
		setValue((prev) =>
			Object.is(prev, defaultValue) ? alternativeValue : defaultValue,
		);
	}, [defaultValue, alternativeValue]);

	const set = useCallback((val: T) => {
		setValue(val);
	}, []);

	return { value, toggle, set };
}
