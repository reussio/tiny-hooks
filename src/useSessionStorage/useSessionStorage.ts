import { useCallback, useEffect, useState } from "react";
import { assertClient } from "../utils/assertClient.ts";
import type {
	UseSessionStorageOptions,
	UseSessionStorageReturn,
} from "./types";

export function useSessionStorage<T>(
	key: string,
	defaultValue: T,
	options: UseSessionStorageOptions = {},
): UseSessionStorageReturn<T> {
	assertClient();
	const { onError } = options;

	const readValue = useCallback((): T => {
		try {
			const item = sessionStorage.getItem(key);
			return item !== null ? JSON.parse(item) : defaultValue;
		} catch (err) {
			onError?.(err as Error);
			return defaultValue;
		}
	}, [key, defaultValue, onError]);

	const [storedValue, setStoredValue] = useState<T>(readValue);

	const setValue = useCallback(
		(value: T) => {
			try {
				setStoredValue(value);
				sessionStorage.setItem(key, JSON.stringify(value));
			} catch (err) {
				onError?.(err as Error);
			}
		},
		[key, onError],
	);

	const remove = useCallback(() => {
		try {
			sessionStorage.removeItem(key);
			setStoredValue(defaultValue);
		} catch (err) {
			onError?.(err as Error);
		}
	}, [key, defaultValue, onError]);

	useEffect(() => {
		const handleStorage = (event: StorageEvent) => {
			if (event.key === key && event.storageArea === sessionStorage) {
				try {
					const item = sessionStorage.getItem(key);
					setStoredValue(item !== null ? JSON.parse(item) : defaultValue);
				} catch (err) {
					onError?.(err as Error);
				}
			}
		};

		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, [key, defaultValue, onError]);

	return [storedValue, setValue, remove] as const;
}
