import { defineConfig } from "cypress";
import { resolveBase } from "./src/utils/resolve-base.ts";

const PUBLIC_BASE_URL = resolveBase(process.env.PUBLIC_BASE_URL);

export default defineConfig({
	env: {
		defaultLocale: "en",
		publicBaseUrl: PUBLIC_BASE_URL,
	},
	e2e: {
		baseUrl: `http://localhost:4321${PUBLIC_BASE_URL}`,
	},
});
