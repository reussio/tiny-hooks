import { useCallback, useEffect, useState } from "react";
import { useBrowserCapabilities } from "../useBrowserCapabilities";
import type { UseClipboardOptions, UseClipboardReturn } from "./types.ts";

export function useClipboard(
	options: UseClipboardOptions = {},
): UseClipboardReturn {
	const { resetAfter = 2000, onCopy, onError, readOnInit = false } = options;

	const caps = useBrowserCapabilities();
	const isSupported = caps.clipboard;

	const [copied, setCopied] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [lastCopiedText, setLastCopiedText] = useState<string | null>(null);

	const copy = useCallback(
		async (text: string) => {
			if (!isSupported) {
				const err = new Error("Clipboard API not supported");
				setError(err.message);
				onError?.(err);
				return;
			}

			try {
				await navigator.clipboard.writeText(text);
				setCopied(true);
				setLastCopiedText(text);
				setError(null);
				onCopy?.(text);

				if (resetAfter !== false) {
					setTimeout(() => setCopied(false), resetAfter);
				}
			} catch (err) {
				const e = err as Error;
				setError(e.message);
				onError?.(e);
			}
		},
		[isSupported, resetAfter, onCopy, onError],
	);

	const read = useCallback(async () => {
		if (!isSupported) {
			const err = new Error("Clipboard API not supported");
			setError(err.message);
			onError?.(err);
			return null;
		}

		try {
			return await navigator.clipboard.readText();
		} catch (err) {
			const e = err as Error;
			setError(e.message);
			onError?.(e);
			return null;
		}
	}, [isSupported, onError]);

	useEffect(() => {
		if (readOnInit && isSupported) {
			read()
				.then(setLastCopiedText)
				.catch(() => {});
		}
	}, [readOnInit, isSupported, read]);

	return {
		copy,
		read,
		isSupported,
		copied,
		error,
		lastCopiedText,
	};
}
