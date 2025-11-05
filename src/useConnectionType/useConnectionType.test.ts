import { beforeEach, describe, expect, it, vi } from "bun:test";
import { renderHook, waitFor } from "@testing-library/react";
import { useConnectionType } from "./useConnectionType";

const createMockConnection = (overrides = {}) => ({
	type: "wifi",
	effectiveType: "4g",
	downlink: 45,
	rtt: 20,
	saveData: false,
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
	...overrides,
});

describe("useConnectionType", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("should return supported=false if Network Information API not available", async () => {
		const originalNavigator = global.navigator;
		// @ts-expect-error
		globalThis.navigator = {};

		const { result } = renderHook(() => useConnectionType());

		await waitFor(() => {
			expect(result.current.supported).toBe(false);
		});

		globalThis.navigator = originalNavigator;
	});

	it("should return connection info and fast speedCategory when API is supported", async () => {
		// @ts-expect-error
		global.navigator.connection = createMockConnection({
			downlink: 10,
			rtt: 50,
		});

		const { result } = renderHook(() => useConnectionType());

		await waitFor(() => {
			expect(result.current.supported).toBe(true);
			expect(result.current.type).toBe("wifi");
			expect(result.current.effectiveType).toBe("4g");
			expect(result.current.downlink).toBe(10);
			expect(result.current.rtt).toBe(50);
			expect(result.current.saveData).toBe(false);
			expect(result.current.speedCategory).toBe("fast");
		});
	});

	it("should correctly calculate medium speedCategory", async () => {
		// @ts-expect-error
		global.navigator.connection = createMockConnection({
			downlink: 3,
			rtt: 150,
		});

		const { result } = renderHook(() => useConnectionType());

		await waitFor(() => {
			expect(result.current.speedCategory).toBe("medium");
		});
	});

	it("should correctly calculate slow speedCategory", async () => {
		// @ts-expect-error
		global.navigator.connection = createMockConnection({
			downlink: 1,
			rtt: 400,
		});

		const { result } = renderHook(() => useConnectionType());

		await waitFor(() => {
			expect(result.current.speedCategory).toBe("slow");
		});
	});

	it("should update when connection change event fires", async () => {
		let changeHandler: (() => void) | undefined;

		const mockConnection = createMockConnection({
			addEventListener: vi.fn((event, handler) => {
				if (event === "change") changeHandler = handler;
			}),
		});

		// @ts-expect-error
		global.navigator.connection = mockConnection;

		const { result } = renderHook(() => useConnectionType());

		await waitFor(() => expect(result.current.speedCategory).toBe("fast"));

		mockConnection.downlink = 0.5;
		mockConnection.rtt = 500;

		changeHandler?.();

		await waitFor(() => {
			expect(result.current.speedCategory).toBe("slow");
		});

		mockConnection.downlink = 10;
		mockConnection.rtt = 50;

		changeHandler?.();

		await waitFor(() => {
			expect(result.current.speedCategory).toBe("fast");
		});
	});
});
