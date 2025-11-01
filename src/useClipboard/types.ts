export interface UseClipboardOptions {
	resetAfter?: number | false;
	onCopy?: (text: string) => void;
	onError?: (error: Error) => void;
	readOnInit?: boolean;
}

export interface UseClipboardReturn {
	copy: (text: string) => Promise<void>;
	read: () => Promise<string | null>;
	isSupported: boolean;
	copied: boolean;
	error: string | null;
	lastCopiedText: string | null;
}
