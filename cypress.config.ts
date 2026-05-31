import { defineConfig } from "cypress";

// !IMPORTANTIf astro.config.mjs `base` changes (e.g. PUBLIC_BASE_URL env is set), update
// the trailing path below to match — Cypress must visit the same base path
// the Astro dev server serves under.
const PUBLIC_BASE_URL = "/dong/";

export default defineConfig({
	env: {
		defaultLocale: "en",
	},
	e2e: {
		baseUrl: `http://localhost:4321${PUBLIC_BASE_URL}`,
	},
});
