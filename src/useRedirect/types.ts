export interface UseRedirectReturn {
	redirect: () => void;
	redirectTo: (url: string) => void;
	redirectUrl: string;
}
