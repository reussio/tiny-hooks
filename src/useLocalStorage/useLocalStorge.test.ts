import { beforeEach, describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";
import "../../test/setup";

describe("useLocalStorage", () => {
	const KEY = "test-key";

	beforeEach(() => {
		localStorage.clear();
	});

	it("should return the default value if localStorage is empty", () => {
		const { result } = renderHook(() => useLocalStorage(KEY, "default"));
		expect(result.current[0]).toBe("default");
	});

	it("should initialize from localStorage if present", () => {
		localStorage.setItem(KEY, JSON.stringify("stored"));
		const { result } = renderHook(() => useLocalStorage(KEY, "default"));
		expect(result.current[0]).toBe("stored");
	});

	it("should set and persist new value", () => {
		const { result } = renderHook(() => useLocalStorage(KEY, "default"));

		act(() => {
			result.current[1]("newValue");
		});

		expect(result.current[0]).toBe("newValue");
		expect(localStorage.getItem(KEY)).toBe(JSON.stringify("newValue"));
	});

	it("should remove the key and reset to default", () => {
		const { result } = renderHook(() => useLocalStorage(KEY, "default"));

		act(() => {
			result.current[1]("toBeRemoved");
		});
		expect(result.current[0]).toBe("toBeRemoved");

		act(() => {
			result.current[2]();
		});

		expect(result.current[0]).toBe("default");
		expect(localStorage.getItem(KEY)).toBe(null);
	});

	it("should support complex types like objects", () => {
		const defaultValue = { count: 1 };
		const newValue = { count: 5 };

		const { result } = renderHook(() => useLocalStorage(KEY, defaultValue));

		act(() => {
			result.current[1](newValue);
		});

		expect(result.current[0]).toEqual(newValue);
		expect(JSON.parse(<string>localStorage.getItem(KEY))).toEqual(newValue);
	});
});
