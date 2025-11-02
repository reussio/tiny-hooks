import { describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "./useDebounce";
import "../../test/setup";

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("useDebounce", () => {
	it("should return initial value immediately", () => {
		const { result } = renderHook(() => useDebounce("initial", { delay: 500 }));
		expect(result.current).toBe("initial");
	});

	it("should update the debounced value after delay", async () => {
		const { result, rerender } = renderHook(
			({ value, options }) => useDebounce(value, options),
			{ initialProps: { value: "a", options: { delay: 100 } } },
		);

		rerender({ value: "b", options: { delay: 100 } });

		expect(result.current).toBe("a");

		await act(async () => {
			await sleep(120);
		});

		expect(result.current).toBe("b");
	});

	it("should reset the debounce timer if value changes quickly", async () => {
		const { result, rerender } = renderHook(
			({ value, options }) => useDebounce(value, options),
			{ initialProps: { value: "start", options: { delay: 100 } } },
		);

		rerender({ value: "v1", options: { delay: 100 } });
		await sleep(50);
		rerender({ value: "v2", options: { delay: 100 } });

		expect(result.current).toBe("start");

		await act(async () => {
			await sleep(110);
		});

		expect(result.current).toBe("v2");
	});

	it("should update immediately if leading = true", async () => {
		const { result, rerender } = renderHook(
			({ value, options }) => useDebounce(value, options),
			{
				initialProps: {
					value: "first",
					options: { delay: 100, leading: true },
				},
			},
		);

		expect(result.current).toBe("first");

		rerender({ value: "second", options: { delay: 100, leading: true } });

		expect(result.current).toBe("second");

		await act(async () => {
			await sleep(120);
		});

		expect(result.current).toBe("second");
	});
});
