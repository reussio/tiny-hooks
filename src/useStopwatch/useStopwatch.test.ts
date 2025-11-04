import { describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useStopwatch } from "./useStopwatch";
import "../../test/setup";

function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("useStopwatch", () => {
	it("should start at 0", () => {
		const { result } = renderHook(() => useStopwatch({ interval: 50 }));
		expect(result.current.time).toBe(0);
	});

	it("should increase time after start", async () => {
		const { result } = renderHook(() => useStopwatch({ interval: 50 }));

		act(() => {
			result.current.start();
		});

		await wait(150);

		act(() => {});

		expect(result.current.time).toBeGreaterThan(0);
	});

	it("should reset time", async () => {
		const { result } = renderHook(() => useStopwatch({ interval: 50 }));

		act(() => {
			result.current.start();
		});

		await wait(100);

		act(() => {
			result.current.reset();
		});

		expect(result.current.time).toBe(0);
	});

	it("should resume from paused time", async () => {
		const { result } = renderHook(() => useStopwatch({ interval: 50 }));

		act(() => {
			result.current.start();
		});

		await wait(100);

		act(() => {
			result.current.stop();
		});

		const timeBeforeResume = result.current.time;

		act(() => {
			result.current.start();
		});

		await wait(100);

		act(() => {});

		expect(result.current.time).toBeGreaterThanOrEqual(timeBeforeResume);
	});
});
