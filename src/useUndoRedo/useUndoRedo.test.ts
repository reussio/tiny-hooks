import { describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useUndoRedo } from "./useUndoRedo";

describe("useUndoRedo", () => {
	it("should initialize with initial value", () => {
		const { result } = renderHook(() => useUndoRedo("initial"));
		expect(result.current.value).toBe("initial");
		expect(result.current.canUndo).toBe(false);
		expect(result.current.canRedo).toBe(false);
		expect(result.current.history).toEqual({
			past: [],
			present: "initial",
			future: [],
		});
	});

	it("should set new values and track history", () => {
		const { result } = renderHook(() => useUndoRedo("initial"));

		act(() => result.current.set("first"));
		expect(result.current.value).toBe("first");
		expect(result.current.canUndo).toBe(true);
		expect(result.current.canRedo).toBe(false);
		expect(result.current.history.past).toEqual(["initial"]);

		act(() => result.current.set("second"));
		expect(result.current.value).toBe("second");
		expect(result.current.history.past).toEqual(["initial", "first"]);
	});

	it("should undo values correctly", () => {
		const { result } = renderHook(() => useUndoRedo("initial"));

		act(() => result.current.set("first"));
		act(() => result.current.set("second"));
		expect(result.current.value).toBe("second");

		act(() => result.current.undo());
		expect(result.current.value).toBe("first");
		expect(result.current.canUndo).toBe(true);
		expect(result.current.canRedo).toBe(true);

		act(() => result.current.undo());
		expect(result.current.value).toBe("initial");
		expect(result.current.canUndo).toBe(false);
		expect(result.current.canRedo).toBe(true);

		// undo when cannot undo should do nothing
		act(() => result.current.undo());
		expect(result.current.value).toBe("initial");
	});

	it("should redo values correctly", () => {
		const { result } = renderHook(() => useUndoRedo("initial"));

		act(() => result.current.set("first"));
		act(() => result.current.set("second"));

		act(() => result.current.undo());
		expect(result.current.value).toBe("first");

		act(() => result.current.redo());
		expect(result.current.value).toBe("second");

		// redo when cannot redo should do nothing
		act(() => result.current.redo());
		expect(result.current.value).toBe("second");
	});

	it("should reset values correctly", () => {
		const { result } = renderHook(() => useUndoRedo("initial"));

		act(() => result.current.set("first"));
		act(() => result.current.set("second"));

		act(() => result.current.reset());
		expect(result.current.value).toBe("initial");
		expect(result.current.canUndo).toBe(false);
		expect(result.current.canRedo).toBe(false);
		expect(result.current.history).toEqual({
			past: [],
			present: "initial",
			future: [],
		});
	});

	it("should respect history limit", () => {
		const { result } = renderHook(() => useUndoRedo("0", { limit: 3 }));

		act(() => result.current.set("1"));
		act(() => result.current.set("2"));
		act(() => result.current.set("3"));
		act(() => result.current.set("4"));

		expect(result.current.history.past).toEqual(["1", "2", "3"]);
		expect(result.current.history.present).toBe("4");
	});

	it("should handle complex objects", () => {
		const initial = { a: 1, b: 2 };
		const { result } = renderHook(() => useUndoRedo(initial));

		act(() => result.current.set({ a: 10, b: 20 }));
		expect(result.current.value).toEqual({ a: 10, b: 20 });

		act(() => result.current.undo());
		expect(result.current.value).toEqual(initial);
	});
});
