export interface UseBooleanReturn {
	value: boolean;
	setTrue: () => void;
	setFalse: () => void;
	set: (val: boolean) => void;
	toggle: () => void;
}
