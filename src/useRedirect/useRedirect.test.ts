import { beforeEach, describe, expect, it } from "bun:test";
import { renderHook } from "@testing-library/react";
import { useRedirect } from "./useRedirect";
import "../../test/setup";

describe("useRedirect", () => {
	beforeEach(() => {
		window.history.pushState({}, "", "/");
	});

	it("should return redirectUrl from query param if exists", () => {
		const url = "/?redirect=/dashboard";
		window.history.pushState({}, "", url);

		const { result } = renderHook(() => useRedirect("/fallback"));
		const redirectUrl = new URL(
			result.current.redirectUrl,
			window.location.origin,
		).pathname;
		expect(redirectUrl).toBe("/dashboard");
	});

	it("should return fallback if no redirect param", () => {
		window.history.pushState({}, "", "/");

		const { result } = renderHook(() => useRedirect("/fallback"));
		const redirectUrl = new URL(
			result.current.redirectUrl,
			window.location.origin,
		).pathname;
		expect(redirectUrl).toBe("/fallback");
	});

	it("should compute redirect() URL correctly", () => {
		window.history.pushState({}, "", "/?redirect=/home");
		const { result } = renderHook(() => useRedirect("/fallback"));

		const redirectUrl = new URL(
			result.current.redirectUrl,
			window.location.origin,
		).pathname;
		expect(redirectUrl).toBe("/home");
	});
});
