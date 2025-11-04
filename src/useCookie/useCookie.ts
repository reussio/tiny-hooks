import { useEffect, useState } from "react";
import { assertClient } from "../utils/assertClient.ts";

async function getCookie(name: string): Promise<string | null> {
	if (typeof navigator === "undefined" || !("cookies" in navigator))
		return null;
	// biome-ignore lint/suspicious/noExplicitAny: TS just dump
	const cookie = await (navigator as any).cookies.get({ name });
	return cookie?.value ?? null;
}

async function setCookie(name: string, value: string, days = 7): Promise<void> {
	if (typeof navigator === "undefined" || !("cookies" in navigator)) return;
	const expires = new Date(Date.now() + days * 864e5);
	// biome-ignore lint/suspicious/noExplicitAny: TS just dump
	await (navigator as any).cookies.set({
		name,
		value,
		expires,
		path: "/",
	});
}

async function deleteCookie(name: string): Promise<void> {
	if (typeof navigator === "undefined" || !("cookies" in navigator)) return;
	// biome-ignore lint/suspicious/noExplicitAny: TS just dump
	await (navigator as any).cookies.delete({ name, path: "/" });
}

export function useCookie(name: string, initialValue = "") {
	assertClient();
	const [value, setValue] = useState<string>(initialValue);

	useEffect(() => {
		getCookie(name).then((val) => {
			if (val !== null) setValue(val);
		});
	}, [name]);

	const updateCookie = async (newValue: string, days = 7) => {
		await setCookie(name, newValue, days);
		setValue(newValue);
	};

	const removeCookie = async () => {
		await deleteCookie(name);
		setValue("");
	};

	return { value, setValue: updateCookie, deleteCookie: removeCookie };
}
