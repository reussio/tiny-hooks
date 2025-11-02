import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";
import { fireEvent } from "@testing-library/dom";
import { renderHook } from "@testing-library/react";
import { useClickOutside } from "./useClickOutside";
import "../../test/setup";

describe("useClickOutside", () => {
	let div: HTMLDivElement;

	beforeEach(() => {
		div = document.createElement("div");
		document.body.appendChild(div);
	});

	afterEach(() => {
		document.body.removeChild(div);
	});

	it("should call callback when clicking outside the element (mousedown)", () => {
		const callback = vi.fn();

		const { unmount } = renderHook(({ ref, cb }) => useClickOutside(ref, cb), {
			initialProps: { ref: { current: div }, cb: callback },
		});

		fireEvent.mouseDown(document.body);
		expect(callback).toHaveBeenCalledTimes(1);

		unmount();
	});

	it("should call callback when touching outside the element (touchstart)", () => {
		const callback = vi.fn();

		const { unmount } = renderHook(({ ref, cb }) => useClickOutside(ref, cb), {
			initialProps: { ref: { current: div }, cb: callback },
		});

		fireEvent.touchStart(document.body);
		expect(callback).toHaveBeenCalledTimes(1);

		unmount();
	});

	it("should not call callback when interacting inside the element", () => {
		const callback = vi.fn();

		const { unmount } = renderHook(({ ref, cb }) => useClickOutside(ref, cb), {
			initialProps: { ref: { current: div }, cb: callback },
		});

		fireEvent.mouseDown(div);
		fireEvent.touchStart(div);
		expect(callback).not.toHaveBeenCalled();

		unmount();
	});

	it("should clean up event listeners on unmount", () => {
		const callback = vi.fn();

		const { unmount } = renderHook(({ ref, cb }) => useClickOutside(ref, cb), {
			initialProps: { ref: { current: div }, cb: callback },
		});

		unmount();

		fireEvent.mouseDown(document.body);
		fireEvent.touchStart(document.body);
		expect(callback).not.toHaveBeenCalled();
	});
});
