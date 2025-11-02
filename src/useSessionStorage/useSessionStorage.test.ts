import { beforeEach, describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useSessionStorage } from "./useSessionStorage";
import "../../test/setup";

describe("useSessionStorage", () => {
	const KEY = "test-session-key";

	beforeEach(() => {
		sessionStorage.clear();
	});

	it("should return the default value if sessionStorage is empty", () => {
		const { result } = renderHook(() => useSessionStorage(KEY, "default"));
		const [storedValue] = result.current;
		expect(storedValue).toBe("default");
	});

	it("should set and retrieve a value from sessionStorage", () => {
		const { result } = renderHook(() => useSessionStorage(KEY, "default"));

		act(() => {
			const [, setValue] = result.current;
			setValue("updated");
		});

		const [storedValue] = result.current;
		expect(storedValue).toBe("updated");
		expect(sessionStorage.getItem(KEY)).toBe(JSON.stringify("updated"));
	});

	it("should remove the key and reset to default", () => {
		const { result } = renderHook(() => useSessionStorage(KEY, "default"));

		act(() => {
			const [, setValue, remove] = result.current;
			setValue("toBeRemoved");
			remove();
		});

		const [storedValue] = result.current;
		expect(storedValue).toBe("default");
		expect(sessionStorage.getItem(KEY)).toBeNull();
	});

	it.skip("should update value if sessionStorage changes in another tab", () => {
		// This test cannot reliably run in Bun/Node environment
	});
});
