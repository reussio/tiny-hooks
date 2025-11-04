import { beforeEach, describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useCookie } from "./useCookie";
import "../../test/setup";

const mockCookies: Record<string, string> = {};

beforeEach(() => {
	for (const key in mockCookies) delete mockCookies[key];

	if (typeof navigator !== "undefined") {
		// biome-ignore lint/suspicious/noExplicitAny: TS just dump
		(navigator as any).cookies = {
			get: ({ name }: { name: string }) => {
				return Promise.resolve(
					mockCookies[name] ? { value: mockCookies[name] } : undefined,
				);
			},
			set: ({ name, value }: { name: string; value: string }) => {
				mockCookies[name] = value;
				return Promise.resolve();
			},
			delete: ({ name }: { name: string }) => {
				delete mockCookies[name];
				return Promise.resolve();
			},
		};
	}
});

describe("useCookie (Cookie Store API)", () => {
	it("should initialize with initial value if no cookie exists", async () => {
		const { result } = renderHook(() => useCookie("test", "default"));
		expect(result.current.value).toBe("default");
	});

	it("should initialize with existing cookie value", async () => {
		mockCookies.test = "existing";

		// biome-ignore lint/suspicious/noExplicitAny: TS just dump
		let result: any;
		await act(async () => {
			result = renderHook(() => useCookie("test", "default")).result;
		});

		expect(result.current.value).toBe("existing");
	});

	it("should update cookie value with setValue", async () => {
		const { result } = renderHook(() => useCookie("test", "initial"));

		await act(async () => {
			await result.current.setValue("updated");
		});

		expect(result.current.value).toBe("updated");
		expect(mockCookies.test).toBe("updated");
	});

	it("should remove cookie with deleteCookie", async () => {
		const { result } = renderHook(() => useCookie("token", "abc123"));

		await act(async () => {
			await result.current.setValue("xyz456");
		});
		expect(result.current.value).toBe("xyz456");

		await act(async () => {
			await result.current.deleteCookie();
		});

		expect(result.current.value).toBe("");
		expect(mockCookies.token).toBeUndefined();
	});

	it("should persist updated cookie values across rerenders", async () => {
		const { result, rerender } = renderHook(() => useCookie("myKey", "start"));

		await act(async () => {
			await result.current.setValue("step1");
		});

		rerender();

		expect(result.current.value).toBe("step1");
		expect(mockCookies.myKey).toBe("step1");
	});
});
