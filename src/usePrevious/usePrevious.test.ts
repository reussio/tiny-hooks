import { describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { usePrevious } from "./usePrevious";
import "../../test/setup";

describe("usePrevious", () => {
	it("should return undefined on first render", () => {
		const { result } = renderHook(() => usePrevious("initial"));
		expect(result.current).toBeUndefined();
	});

	it("should return previous value after update", () => {
		let value = "first";

		const { result, rerender } = renderHook(() => usePrevious(value));

		act(() => {
			value = "second";
			rerender();
		});

		expect(result.current).toBe("first");

		act(() => {
			value = "third";
			rerender();
		});

		expect(result.current).toBe("second");
	});

	it("should work with numbers", () => {
		let value = 0;
		const { result, rerender } = renderHook(() => usePrevious(value));

		act(() => {
			value = 1;
			rerender();
		});
		expect(result.current).toBe(0);

		act(() => {
			value = 2;
			rerender();
		});
		expect(result.current).toBe(1);
	});
});
