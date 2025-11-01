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
});
