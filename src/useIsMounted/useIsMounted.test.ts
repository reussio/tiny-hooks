import { describe, expect, it } from "bun:test";
import { renderHook } from "@testing-library/react";
import { useIsMounted } from "./useIsMounted";
import "../../test/setup";

describe("useIsMounted", () => {
	it("should return true when mounted", () => {
		const { result } = renderHook(() => useIsMounted());
		expect(result.current.isMounted).toBe(true);
		expect(result.current.getIsMounted()).toBe(true);
	});

	it("should return false after unmount", () => {
		const { result, unmount } = renderHook(() => useIsMounted());
		unmount();
		expect(result.current.getIsMounted()).toBe(false);
	});
});
