import type { APIRoute } from "astro";
import { currentLocaleWebsiteConfig } from "@/utils/getWebsiteConfig.ts";
import { defaultLocale } from "@/utils/i18n.ts";

const { name, themeColor } = (await currentLocaleWebsiteConfig(defaultLocale))
	.data.brand;

// https://web.dev/articles/add-manifest
// eslint-disable-next-line import/prefer-default-export
export const GET: APIRoute = () =>
	new Response(
		JSON.stringify({
			name,
			icons: [
				{
					src: `${import.meta.env.BASE_URL}images/brand/favicon/icon-192.png`,
					type: "image/png",
					sizes: "192x192",
				},
				{
					src: `${import.meta.env.BASE_URL}images/brand/favicon/icon-512.png`,
					type: "image/png",
					sizes: "512x512",
				},
				{
					src: `${import.meta.env.BASE_URL}images/brand/favicon/maskable-icon-512.png`,
					type: "image/png",
					sizes: "512x512",
					purpose: "maskable",
				},
			],
			start_url: import.meta.env.BASE_URL,
			display: "fullscreen",
			theme_color: themeColor,
			background_color: themeColor,
		}),
	);
