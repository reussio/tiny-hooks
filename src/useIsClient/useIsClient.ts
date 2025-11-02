import { useEffect, useState } from "react";

export function useIsClient(): boolean {
	const isClientEnvironment: boolean = typeof window !== "undefined";
	const [isClient, setIsClient] = useState(isClientEnvironment);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return isClient;
}
