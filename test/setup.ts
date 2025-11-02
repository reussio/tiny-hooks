import { JSDOM } from "jsdom";

const dom = new JSDOM('<!DOCTYPE html><html lang="en"><body></body></html>', {
	url: "http://localhost",
});

globalThis.window = dom.window as never;
globalThis.document = dom.window.document;
globalThis.navigator = dom.window.navigator;
globalThis.localStorage = dom.window.localStorage;
