import { useCallback, useEffect, useState } from "react";
import type {
	UseSessionStorageOptions,
	UseSessionStorageReturn,
} from "./types";

export function useSessionStorage<T>(
	key: string,
	defaultValue: T,
	options: UseSessionStorageOptions = {},
): UseSessionStorageReturn<T> {
	const { onError } = options;

	const readValue = useCallback((): T => {
		if (typeof window === "undefined") return defaultValue;

		try {
			const item = window.sessionStorage.getItem(key);
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
				if (typeof window !== "undefined") {
					window.sessionStorage.setItem(key, JSON.stringify(value));
				}
			} catch (err) {
				onError?.(err as Error);
			}
		},
		[key, onError],
	);

	const remove = useCallback(() => {
		try {
			if (typeof window !== "undefined") {
				window.sessionStorage.removeItem(key);
			}
			setStoredValue(defaultValue);
		} catch (err) {
			onError?.(err as Error);
		}
	}, [key, defaultValue, onError]);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleStorage = (event: StorageEvent) => {
			if (event.key === key && event.storageArea === window.sessionStorage) {
				try {
					const item = window.sessionStorage.getItem(key);
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
