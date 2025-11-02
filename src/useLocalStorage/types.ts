export type UseLocalStorageOptions = {
	onError?: (error: Error) => void;
};

export type UseLocalStorageReturn<T> = readonly [
	T,
	(value: T) => void,
	() => void,
];
