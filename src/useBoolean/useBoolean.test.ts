import { describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useBoolean } from "./useBoolean";
import "../../test/setup";

describe("useBoolean", () => {
	it("should initialize with default value false", () => {
		const { result } = renderHook(() => useBoolean());
		expect(result.current.value).toBe(false);
	});

	it("should initialize with given true value", () => {
		const { result } = renderHook(() => useBoolean(true));
		expect(result.current.value).toBe(true);
	});

	it("should set value to true", () => {
		const { result } = renderHook(() => useBoolean(false));

		act(() => {
			result.current.setTrue();
		});

		expect(result.current.value).toBe(true);
	});

	it("should set value to false", () => {
		const { result } = renderHook(() => useBoolean(true));

		act(() => {
			result.current.setFalse();
		});

		expect(result.current.value).toBe(false);
	});

	it("should set value directly using set", () => {
		const { result } = renderHook(() => useBoolean(false));

		act(() => {
			result.current.set(true);
		});
		expect(result.current.value).toBe(true);

		act(() => {
			result.current.set(false);
		});
		expect(result.current.value).toBe(false);
	});

	it("should toggle value", () => {
		const { result } = renderHook(() => useBoolean(false));

		act(() => {
			result.current.toggle();
		});
		expect(result.current.value).toBe(true);

		act(() => {
			result.current.toggle();
		});
		expect(result.current.value).toBe(false);
	});

	it("should toggle from true to false and back", () => {
		const { result } = renderHook(() => useBoolean(true));

		act(() => {
			result.current.toggle();
		});
		expect(result.current.value).toBe(false);

		act(() => {
			result.current.toggle();
		});
		expect(result.current.value).toBe(true);
	});
});
