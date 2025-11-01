import type { DOMWindow } from "jsdom";

declare namespace globalThis {
	var window: DOMWindow;
	var document: Document;
	var navigator: Navigator;
}
