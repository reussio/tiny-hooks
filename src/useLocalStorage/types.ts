export type UseLocalStorageOptions = {
	onError?: (error: Error) => void;
};

export type UseLocalStorageReturn<T> = [T, (value: T) => void, () => void];
