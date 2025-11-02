import { describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useHover } from "./useHover";
import "../../test/setup";

describe("useHover", () => {
	it("should be false by default", () => {
		const { result } = renderHook(() => useHover());
		expect(result.current.isHovered).toBe(false);
	});

	it("should become true on mouseenter and false on mouseleave", () => {
		const { result } = renderHook(() => useHover());

		const div = document.createElement("div");

		act(() => {
			result.current.ref(div);
		});

		act(() => {
			div.dispatchEvent(new MouseEvent("mouseenter"));
		});
		expect(result.current.isHovered).toBe(true);

		act(() => {
			div.dispatchEvent(new MouseEvent("mouseleave"));
		});
		expect(result.current.isHovered).toBe(false);
	});
});
