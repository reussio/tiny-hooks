export type UseSessionStorageOptions = {
	onError?: (error: Error) => void;
};

export type UseSessionStorageReturn<T> = readonly [
	T,
	(value: T) => void,
	() => void,
];
