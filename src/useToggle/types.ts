export type UseToggleReturn<T> = {
	value: T;
	toggle: () => void;
	set: (value: T) => void;
};
