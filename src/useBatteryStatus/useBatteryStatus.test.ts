import { beforeEach, describe, expect, it, vi } from "bun:test";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useBatteryStatus } from "./useBatteryStatus";

const createMockBattery = (overrides = {}) => ({
	charging: true,
	level: 0.85,
	chargingTime: 1200,
	dischargingTime: 3600,
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
	...overrides,
});

describe("useBatteryStatus", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("should return supported=false if Battery API not available", async () => {
		const originalNavigator = global.navigator;
		// @ts-expect-error
		globalThis.navigator = {};

		const { result } = renderHook(() => useBatteryStatus());

		await waitFor(() => {
			expect(result.current.supported).toBe(false);
		});

		globalThis.navigator = originalNavigator;
	});

	it("should return initial battery data if Battery API is available", async () => {
		const mockBattery = createMockBattery();
		// @ts-expect-error
		global.navigator.getBattery = vi.fn().mockResolvedValue(mockBattery);

		const { result } = renderHook(() => useBatteryStatus());

		await waitFor(() => {
			expect(result.current.supported).toBe(true);
			expect(result.current.charging).toBe(true);
			expect(result.current.level).toBe(0.85);
			expect(result.current.chargingTime).toBe(1200);
			expect(result.current.dischargingTime).toBe(3600);
		});
	});

	it("should update state when battery events fire", async () => {
		let changeHandler: (() => void) | undefined;

		const mockBattery = createMockBattery({
			addEventListener: vi.fn((event, handler) => {
				if (event === "levelchange") changeHandler = handler;
			}),
		});
		// @ts-expect-error
		global.navigator.getBattery = vi.fn().mockResolvedValue(mockBattery);

		const { result } = renderHook(() => useBatteryStatus());

		await waitFor(() => expect(result.current.supported).toBe(true));

		mockBattery.level = 0.5;

		act(() => {
			changeHandler?.();
		});

		await waitFor(() => {
			expect(result.current.level).toBe(0.5);
		});
	});
});
