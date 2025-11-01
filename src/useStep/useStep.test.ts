import { describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useStep } from "./useStep";
import "../../test/setup";

describe("useStep", () => {
	it("should initialize with default step", () => {
		const { result } = renderHook(() => useStep(1, { minStep: 0, maxStep: 3 }));
		expect(result.current.step).toBe(1);
	});

	it("should not go below minStep or above maxStep", () => {
		const { result } = renderHook(() => useStep(1, { minStep: 0, maxStep: 3 }));

		act(() => {
			result.current.prev();
		});
		expect(result.current.step).toBe(0);

		act(() => {
			result.current.setStep(10);
		});
		expect(result.current.step).toBe(3);
	});

	it("should go next and prev correctly", () => {
		const { result } = renderHook(() => useStep(1, { minStep: 0, maxStep: 3 }));

		act(() => {
			result.current.next();
		});
		expect(result.current.step).toBe(2);

		act(() => {
			result.current.next();
		});
		expect(result.current.step).toBe(3);

		act(() => {
			result.current.next();
		});
		expect(result.current.step).toBe(3);

		act(() => {
			result.current.prev();
		});
		expect(result.current.step).toBe(2);
	});

	it("should reset to initial step", () => {
		const { result } = renderHook(() => useStep(1, { minStep: 0, maxStep: 3 }));

		act(() => {
			result.current.next();
		});
		expect(result.current.step).toBe(2);

		act(() => {
			result.current.reset();
		});
		expect(result.current.step).toBe(1);
	});

	it("should skip forward correctly", () => {
		const { result } = renderHook(() => useStep(1, { minStep: 0, maxStep: 5 }));

		act(() => {
			result.current.skip(2);
		});
		expect(result.current.step).toBe(3);

		act(() => {
			result.current.skip(10);
		});
		expect(result.current.step).toBe(5);
	});

	it("should skip backward correctly", () => {
		const { result } = renderHook(() => useStep(2, { minStep: 0, maxStep: 5 }));

		act(() => {
			result.current.skip(-1);
		});
		expect(result.current.step).toBe(1);

		act(() => {
			result.current.skip(-10);
		});
		expect(result.current.step).toBe(0);
	});

	it("should handle skip by zero", () => {
		const { result } = renderHook(() => useStep(2, { minStep: 0, maxStep: 5 }));

		act(() => {
			result.current.skip(0);
		});
		expect(result.current.step).toBe(2);
	});
});
