export interface BrowserCapabilities {
	clipboard: boolean;
	geolocation: boolean;
	localStorage: boolean;
	sessionStorage: boolean;
	notifications: boolean;
	serviceWorker: boolean;
	fetch: boolean;
	webSocket: boolean;
	fileReader: boolean;
	online: boolean;
	mediaDevices: boolean;
}
