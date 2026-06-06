import { defineConfig } from "cypress";

const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL
	? `/${process.env.PUBLIC_BASE_URL}/`.replace(/\/{2,}/g, "/")
	: "/dong/";

export default defineConfig({
	env: {
		defaultLocale: "en",
		publicBaseUrl: PUBLIC_BASE_URL,
	},
	e2e: {
		baseUrl: `http://localhost:4321${PUBLIC_BASE_URL}`,
	},
});
