import { describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import "../../test/setup";
import { useToggle } from "./useToggle";

describe("useToggle", () => {
	it("should initialize with defaultValue", () => {
		const { result } = renderHook(() => useToggle(true, false));
		expect(result.current.value).toBe(true);
	});

	it("should toggle between defaultValue and alternativeValue", () => {
		const { result } = renderHook(() => useToggle("on", "off"));

		act(() => {
			result.current.toggle();
		});
		expect(result.current.value).toBe("off");

		act(() => {
			result.current.toggle();
		});
		expect(result.current.value).toBe("on");
	});

	it("should set a specific value", () => {
		const { result } = renderHook(() => useToggle(1, 2));

		act(() => {
			result.current.set(2);
		});
		expect(result.current.value).toBe(2);

		act(() => {
			result.current.set(1);
		});
		expect(result.current.value).toBe(1);
	});

	it("should still toggle correctly after manual set", () => {
		const { result } = renderHook(() => useToggle("A", "B"));

		act(() => {
			result.current.set("B");
		});
		expect(result.current.value).toBe("B");

		act(() => {
			result.current.toggle();
		});
		expect(result.current.value).toBe("A");
	});

	it("should toggle objects by reference", () => {
		const obj1 = { x: 1 };
		const obj2 = { x: 2 };
		const { result } = renderHook(() => useToggle(obj1, obj2));

		expect(result.current.value).toBe(obj1);

		act(() => {
			result.current.toggle();
		});
		expect(result.current.value).toBe(obj2);

		act(() => {
			result.current.toggle();
		});
		expect(result.current.value).toBe(obj1);
	});

	it("should toggle arrays by reference", () => {
		const arr1 = [1, 2];
		const arr2 = [3, 4];
		const { result } = renderHook(() => useToggle(arr1, arr2));

		expect(result.current.value).toBe(arr1);

		act(() => {
			result.current.toggle();
		});
		expect(result.current.value).toBe(arr2);
	});

	it("should handle NaN correctly", () => {
		const { result } = renderHook(() => useToggle(NaN, 1));

		expect(Number.isNaN(result.current.value)).toBe(true);

		act(() => {
			result.current.toggle();
		});
		expect(result.current.value).toBe(1);

		act(() => {
			result.current.toggle();
		});
		expect(Number.isNaN(result.current.value)).toBe(true);
	});
});
