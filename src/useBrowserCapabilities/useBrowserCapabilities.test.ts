import { describe, expect, it } from "bun:test";
import { renderHook } from "@testing-library/react";
import { useBrowserCapabilities } from "./useBrowserCapabilities.ts";

describe("useBrowserCapabilities", () => {
	it("should return an object with all boolean fields", () => {
		const { result } = renderHook(() => useBrowserCapabilities());
		const caps = result.current;
		expect(typeof caps).toBe("object");

		expect(Object.values(caps).every((v) => typeof v === "boolean")).toBe(true);
	});
});
