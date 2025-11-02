import { describe, expect, it, jest } from "bun:test";
import { renderHook } from "@testing-library/react";
import { useEventListener } from "./useEventListener";
import "../../test/setup";

describe("useEventListener", () => {
	it("should attach and trigger an event listener on window", () => {
		const handler = jest.fn();

		renderHook(() => useEventListener("click", handler));

		const clickEvent = new MouseEvent("click");
		window.dispatchEvent(clickEvent);

		expect(handler).toHaveBeenCalledTimes(1);
		expect(handler).toHaveBeenCalledWith(expect.any(MouseEvent));
	});

	it("should attach to a specific element", () => {
		const handler = jest.fn();
		const div = document.createElement("div");

		renderHook(() => useEventListener("click", handler, div));

		const clickEvent = new MouseEvent("click");
		div.dispatchEvent(clickEvent);

		expect(handler).toHaveBeenCalledTimes(1);
	});

	it("should clean up the event listener on unmount", () => {
		const handler = jest.fn();

		const { unmount } = renderHook(() => useEventListener("click", handler));

		unmount();

		const clickEvent = new MouseEvent("click");
		window.dispatchEvent(clickEvent);

		expect(handler).not.toHaveBeenCalled();
	});
});
