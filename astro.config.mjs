import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, passthroughImageService } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import { s } from "hastscript";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import remarkMermaid from "remark-mermaidjs";
import { loadEnv } from "vite";
import {
	baseUrl,
	defaultLocale,
	languages,
	prefixDefaultLocale,
} from "./src/utils/i18n.ts";
import { resolveBase } from "./src/utils/resolve-base.ts";

// ENV In the Astro config file
// https://docs.astro.build/en/guides/environment-variables/#in-the-astro-config-file
const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || env.PUBLIC_BASE_URL;

const finalBase = resolveBase(PUBLIC_BASE_URL);

// https://astro.build/config
export default defineConfig({
	base: finalBase,
	// !IMPORTANT: Set site url property with your own domain
	site: baseUrl,
	devToolbar: {
		enabled: !process.env.CI,
	},
	redirects: {
		"/": `${finalBase}${defaultLocale}/`,
		"/post/": `${finalBase}${defaultLocale}/post/`,
		"/shortpost/": `${finalBase}${defaultLocale}/shortpost/`,
	},
	image: {
		service: passthroughImageService(), // Could not find Sharp: https://docs.astro.build/en/reference/errors/missing-sharp/
	},
	i18n: {
		defaultLocale,
		locales: Object.keys(languages),
		routing: {
			prefixDefaultLocale,
			redirectToDefaultLocale: false,
		},
	},
	prefetch: true,

	markdown: {
		processor: unified({
			remarkPlugins: [
				[
					remarkMermaid,
					{
						mermaidConfig: {
							theme: "neutral",
						},
					},
				],
			],
			rehypePlugins: [
				rehypeSlug,
				[
					rehypeAutolinkHeadings,
					{
						behavior: "append",
						properties: {
							class:
								"rehype-auto-link opacity-40 lg:opacity-0 hover:opacity-100 static lg:absolute top-0 -left-4 -translate-x-full transition-opacity",
							ariaHidden: true,
							tabIndex: -1,
						},
						content: [
							s(
								"svg",
								{
									class:
										"inline-block static transform-none lg:transform top-1/2 size-4 md:size-6 ml-2",
									xmlns: "http://www.w3.org/2000/svg",
									width: 24,
									height: 24,
									fill: "currentColor",
									viewBox: "0 0 24 24",
								},
								s("path", {
									d: "M9.199 13.599a5.99 5.99 0 0 0 3.949 2.345 5.987 5.987 0 0 0 5.105-1.702l2.995-2.994a5.992 5.992 0 0 0 1.695-4.285 5.976 5.976 0 0 0-1.831-4.211 5.99 5.99 0 0 0-6.431-1.242 6.003 6.003 0 0 0-1.905 1.24l-1.731 1.721a.999.999 0 1 0 1.41 1.418l1.709-1.699a3.985 3.985 0 0 1 2.761-1.123 3.975 3.975 0 0 1 2.799 1.122 3.997 3.997 0 0 1 .111 5.644l-3.005 3.006a3.982 3.982 0 0 1-3.395 1.126 3.987 3.987 0 0 1-2.632-1.563A1 1 0 0 0 9.201 13.6zm5.602-3.198a5.99 5.99 0 0 0-3.949-2.345 5.987 5.987 0 0 0-5.105 1.702l-2.995 2.994a5.992 5.992 0 0 0-1.695 4.285 5.976 5.976 0 0 0 1.831 4.211 5.99 5.99 0 0 0 6.431 1.242 6.003 6.003 0 0 0 1.905-1.24l1.723-1.723a.999.999 0 1 0-1.414-1.414L9.836 19.81a3.985 3.985 0 0 1-2.761 1.123 3.975 3.975 0 0 1-2.799-1.122 3.997 3.997 0 0 1-.111-5.644l3.005-3.006a3.982 3.982 0 0 1 3.395-1.126 3.987 3.987 0 0 1 2.632 1.563 1 1 0 0 0 1.602-1.198z",
								}),
							),
						],
					},
				],
				[
					rehypeExternalLinks,
					{
						content: {
							type: "element",
							tagName: "span",
							properties: {
								class: "external-link-icon",
							},
							children: [
								{
									type: "text",
									value: "🔗",
								},
							],
						},
					},
				],
			],
		}),
		shikiConfig: {
			theme: "github-dark",
		},
	},
	integrations: [
		expressiveCode({
			themes: ["github-light", "github-dark"],
			// themeCssSelector
			// https://expressive-code.com/reference/configuration/#themecssselector
			themeCssSelector: (theme) => `[data-theme="${theme.type}"]`,
			styleOverrides: {
				codeFontSize: "1rem",
			},
		}),
		mdx({
			drafts: false,
		}),
		sitemap(),
		react({
			include: ["**/react/*"],
		}),
		import.meta.env.DEV
			? ""
			: partytown({
					// Adds dataLayer.push as a forwarding-event.
					config: {
						forward: ["dataLayer.push"],
					},
				}),
		icon(),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
