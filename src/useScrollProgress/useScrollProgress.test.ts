import { describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useScrollProgress } from "./useScrollProgress";
import "../../test/setup";

describe("useScrollProgress", () => {
	it("should return 0 if not scrolled in window and fractional mode", () => {
		const { result } = renderHook(() => useScrollProgress({ throttle: 0 }));
		expect(result.current).toBe(0);
	});

	it("should track scroll progress in window fractional (0-1)", () => {
		Object.defineProperty(window, "scrollY", { writable: true, value: 50 });
		Object.defineProperty(document.documentElement, "scrollHeight", {
			writable: true,
			value: 1000,
		});
		Object.defineProperty(window, "innerHeight", {
			writable: true,
			value: 200,
		});

		const { result } = renderHook(() => useScrollProgress({ throttle: 0 }));

		act(() => {
			window.dispatchEvent(new Event("scroll"));
		});

		const expectedProgress = 50 / (1000 - 200);
		expect(result.current).toBeCloseTo(expectedProgress);
	});

	it("should track scroll progress in window percent (0-100)", () => {
		Object.defineProperty(window, "scrollY", { writable: true, value: 80 });
		Object.defineProperty(document.documentElement, "scrollHeight", {
			writable: true,
			value: 500,
		});
		Object.defineProperty(window, "innerHeight", {
			writable: true,
			value: 100,
		});

		const { result } = renderHook(() =>
			useScrollProgress({ percent: true, throttle: 0 }),
		);

		act(() => {
			window.dispatchEvent(new Event("scroll"));
		});

		const expectedProgress = (80 / (500 - 100)) * 100;
		expect(result.current).toBeCloseTo(expectedProgress);
	});

	it("should track scroll progress on a ref element", () => {
		const scrollable = document.createElement("div");
		Object.defineProperty(scrollable, "scrollTop", {
			writable: true,
			value: 20,
		});
		Object.defineProperty(scrollable, "scrollHeight", {
			writable: true,
			value: 300,
		});
		Object.defineProperty(scrollable, "clientHeight", {
			writable: true,
			value: 100,
		});
		const ref = { current: scrollable };

		const { result } = renderHook(() =>
			useScrollProgress({ ref, throttle: 0 }),
		);

		act(() => {
			scrollable.dispatchEvent(new Event("scroll"));
		});

		const expectedProgress = 20 / (300 - 100);
		expect(result.current).toBeCloseTo(expectedProgress);
	});

	it("should return 0 if scrollHeight <= clientHeight", () => {
		const scrollable = document.createElement("div");
		Object.defineProperty(scrollable, "scrollTop", {
			writable: true,
			value: 0,
		});
		Object.defineProperty(scrollable, "scrollHeight", {
			writable: true,
			value: 100,
		});
		Object.defineProperty(scrollable, "clientHeight", {
			writable: true,
			value: 100,
		});

		const ref = { current: scrollable };

		const { result } = renderHook(() =>
			useScrollProgress({ ref, throttle: 0 }),
		);

		act(() => {
			scrollable.dispatchEvent(new Event("scroll"));
		});

		expect(result.current).toBe(0);
	});
});
