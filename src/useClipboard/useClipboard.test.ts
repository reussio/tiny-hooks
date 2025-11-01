import { beforeEach, describe, expect, it, mock } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useClipboard } from "./useClipboard";
import "../../test/setup";

describe("useClipboard", () => {
	let writeTextMock: ReturnType<typeof mock>;
	let readTextMock: ReturnType<typeof mock>;

	beforeEach(() => {
		writeTextMock = mock(async (_text: string) => {});
		readTextMock = mock(async () => "mock clipboard text");

		global.navigator = {
			clipboard: {
				writeText: writeTextMock,
				readText: readTextMock,
			},
		};
	});

	it("should initialize with default state", () => {
		const { result } = renderHook(() => useClipboard());
		expect(result.current.copied).toBe(false);
		expect(result.current.error).toBeNull();
		expect(result.current.lastCopiedText).toBeNull();
		expect(result.current.isSupported).toBe(true);
	});

	it("should copy text and set copied = true", async () => {
		const { result } = renderHook(() => useClipboard({ resetAfter: false }));

		await act(async () => {
			await result.current.copy("Hello world");
		});

		expect(writeTextMock).toHaveBeenCalledWith("Hello world");
		expect(result.current.copied).toBe(true);
		expect(result.current.lastCopiedText).toBe("Hello world");
		expect(result.current.error).toBeNull();
	});

	it("should call onCopy and onError callbacks", async () => {
		const onCopy = mock(() => {});
		const onError = mock(() => {});
		const { result } = renderHook(() =>
			useClipboard({ onCopy, onError, resetAfter: false }),
		);

		await act(async () => {
			await result.current.copy("Callback test");
		});

		expect(onCopy).toHaveBeenCalledWith("Callback test");
		expect(onError).not.toHaveBeenCalled();
	});

	it("should read clipboard text", async () => {
		const { result } = renderHook(() => useClipboard());

		let text: string | null = null;
		await act(async () => {
			text = await result.current.read();
		});

		expect(readTextMock).toHaveBeenCalled();
		// @ts-expect-error Works
		expect(text).toBe("mock clipboard text");
	});
});
