import { describe, expect, it, vi } from "bun:test";
import { fireEvent } from "@testing-library/dom";
import { renderHook } from "@testing-library/react";
import { useClickAnywhere } from "./useClickAnywhere";
import "../../test/setup";

describe("useClickAnywhere", () => {
	it("should call callback on any click in the document", () => {
		const callback = vi.fn();

		renderHook(() => useClickAnywhere(callback));

		fireEvent.mouseDown(document.body);
		fireEvent.mouseDown(document.documentElement);

		expect(callback).toHaveBeenCalledTimes(2);
	});

	it("should clean up event listener on unmount", () => {
		const callback = vi.fn();

		const { unmount } = renderHook(() => useClickAnywhere(callback));

		unmount();

		fireEvent.mouseDown(document.body);
		expect(callback).not.toHaveBeenCalled();
	});
});
