import { useCallback, useEffect, useState } from "react";
import { assertClient } from "../utils/assertClient.ts";
import type { UseLocalStorageOptions, UseLocalStorageReturn } from "./types";

export function useLocalStorage<T>(
	key: string,
	defaultValue: T,
	options: UseLocalStorageOptions = {},
): UseLocalStorageReturn<T> {
	assertClient();
	const { onError } = options;

	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item !== null ? JSON.parse(item) : defaultValue;
		} catch (err) {
			onError?.(err as Error);
			return defaultValue;
		}
	});

	const setValue = useCallback(
		(value: T) => {
			try {
				setStoredValue(value);
				window.localStorage.setItem(key, JSON.stringify(value));
			} catch (err) {
				onError?.(err as Error);
			}
		},
		[key, onError],
	);

	const remove = useCallback(() => {
		try {
			window.localStorage.removeItem(key);
			setStoredValue(defaultValue);
		} catch (err) {
			onError?.(err as Error);
		}
	}, [key, defaultValue, onError]);

	useEffect(() => {
		const handleStorage = (event: StorageEvent) => {
			if (event.key === key) {
				try {
					const item = window.localStorage.getItem(key);
					setStoredValue(item !== null ? JSON.parse(item) : defaultValue);
				} catch (err) {
					onError?.(err as Error);
				}
			}
		};

		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, [key, defaultValue, onError]);

	return [storedValue, setValue, remove];
}
