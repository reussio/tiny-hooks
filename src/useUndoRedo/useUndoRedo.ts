import { useCallback, useState } from "react";
import { assertClient } from "../utils/assertClient.ts";
import type { UseUndoRedoOptions, UseUndoRedoReturn } from "./types.ts";

export function useUndoRedo<T>(
	initialValue: T,
	options: UseUndoRedoOptions = {},
): UseUndoRedoReturn<T> {
	assertClient();

	const { limit = 50, onChange, onUndo, onRedo } = options;

	const [past, setPast] = useState<T[]>([]);
	const [present, setPresent] = useState<T>(initialValue);
	const [future, setFuture] = useState<T[]>([]);

	const canUndo = past.length > 0;
	const canRedo = future.length > 0;

	const set = useCallback(
		(next: T) => {
			setPast((prev) => {
				const newPast = [...prev, present];
				if (newPast.length > limit) newPast.shift();
				return newPast;
			});
			setPresent(next);
			setFuture([]);
			onChange?.(next);
		},
		[present, limit, onChange],
	);

	const undo = useCallback(() => {
		if (!canUndo) return;

		setPast((prevPast) => {
			const newPast = [...prevPast];
			const previous = newPast.pop()!;
			setFuture((prev) => [present, ...prev]);
			setPresent(previous);
			onUndo?.(previous);
			onChange?.(previous);
			return newPast;
		});
	}, [canUndo, present, onUndo, onChange]);

	const redo = useCallback(() => {
		if (!canRedo) return;

		setFuture((prevFuture) => {
			const newFuture = [...prevFuture];
			const next = newFuture.shift()!;
			setPast((prev) => [...prev, present]);
			setPresent(next);
			onRedo?.(next);
			onChange?.(next);
			return newFuture;
		});
	}, [canRedo, present, onRedo, onChange]);

	const reset = useCallback(() => {
		setPast([]);
		setFuture([]);
		setPresent(initialValue);
		onChange?.(initialValue);
	}, [initialValue, onChange]);

	return {
		value: present,
		set,
		undo,
		redo,
		reset,
		canUndo,
		canRedo,
		history: { past, present, future },
	};
}
