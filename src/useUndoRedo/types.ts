export interface UseUndoRedoOptions<T = unknown> {
	limit?: number;
	onChange?: (value: T) => void;
	onUndo?: (value: T) => void;
	onRedo?: (value: T) => void;
}

export interface UseUndoRedoReturn<T> {
	value: T;
	set: (value: T) => void;
	undo: () => void;
	redo: () => void;
	reset: () => void;
	canUndo: boolean;
	canRedo: boolean;
	history: {
		past: T[];
		present: T;
		future: T[];
	};
}
