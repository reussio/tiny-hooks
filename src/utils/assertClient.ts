export function assertClient(): void {
	if (typeof window === "undefined") {
		throw new Error("This hook can only be used in the browser (client-side).");
	}
}
