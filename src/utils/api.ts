export const fetchWithToken = (url: string, options: RequestInit = {}) => {
	const token = localStorage.getItem("token");

	const isFormData = options.body instanceof FormData;

	const headers: HeadersInit = {
		...(isFormData ? {} : { "Content-Type": "application/json" }),
		Authorization: `Bearer ${token}`,
		...options.headers,
	};

	return fetch(url, {
		...options,
		headers,
	});
};