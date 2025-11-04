import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import "../../test/setup";
import { usePing } from "./usePing";

describe("usePing hook", () => {
	beforeAll(() => {
		globalThis.fetch = (async (url: string | URL) => {
			if (url.toString() === "https://example.com") {
				return {
					ok: true,
					status: 200,
					headers: {
						get: () => null,
					},
				} as unknown as Response;
			}
			return Promise.reject(new Error("Network error"));
		}) as typeof fetch;
	});

	afterAll(() => {
		globalThis.fetch = undefined as unknown as typeof fetch;
	});

	it("should ping once successfully", async () => {
		const { result } = renderHook(() =>
			usePing("https://example.com", { enabled: false }),
		);

		let pingValue: number | null = null;

		await act(async () => {
			pingValue = await result.current.pingOnce();
		});

		expect(pingValue).not.toBeNull();
		expect(result.current.ping).toBe(pingValue);
		expect(result.current.averagePing).toBe(pingValue);
		expect(result.current.error).toBeNull();
		expect(result.current.lastSuccess).toBeInstanceOf(Date);
	});

	it("should handle ping failure", async () => {
		const { result } = renderHook(() =>
			usePing("https://fail.example.com", { enabled: false }),
		);

		let pingValue: number | null = null;

		await act(async () => {
			pingValue = await result.current.pingOnce();
		});

		expect(pingValue).toBeNull();
		expect(result.current.ping).toBeNull();
		expect(result.current.averagePing).toBeNull();
		expect(result.current.error).toBeDefined();
		expect(result.current.lastSuccess).toBeNull();
	});

	it("should maintain averagePing over multiple pings", async () => {
		const { result } = renderHook(() =>
			usePing("https://example.com", { enabled: false, averageOver: 3 }),
		);

		await act(async () => {
			await result.current.pingOnce();
			await result.current.pingOnce();
			await result.current.pingOnce();
		});

		expect(result.current.averagePing).not.toBeNull();
		expect(result.current.averagePing).toBeGreaterThan(0);
	});
});
