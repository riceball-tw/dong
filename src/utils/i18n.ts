import {
	defaultLocale,
	type LanguageKey,
	type LanguageValue,
	languages,
	prefixDefaultLocale,
} from "../i18n/i18n";

export { defaultLocale, languages, prefixDefaultLocale };
export type { LanguageKey, LanguageValue };

// !IMPORTANT: Set site url property with your own domain
export const baseUrl = "https://www.webdong.dev/";

export const languageFallback = {
	"zh-cn": "zh-tw",
	en: "zh-tw",
} as const;

// IETF language tag
export const languageTags = {
	en: "en",
	"zh-cn": "zh-Hans",
	"zh-tw": "zh-Hant-TW",
} as const;

export const regionTags = {
	zh: "zh-Hant-TW",
} as const;

export function stripLanguageCode(str: string) {
	return str.replace(/^[a-z]{2}(-[a-z]{2})?\//i, "");
}

export function getLanguageCode(str: string): string | null {
	const match = str.match(/^[a-z]{2}(-[a-z]{2})?\//i);
	return match ? match[0].slice(0, -1) : null;
}

export function removeLanguagePrefix(
	path: string,
	languagePrefixes: string[],
): string {
	const prefixRegex = new RegExp(`^/(${languagePrefixes.join("|")})`);
	return path.replace(prefixRegex, "").replace(/^\/+/, "");
}

function constructNewPath(
	targetLocale: LanguageKey,
	path: string,
	isDefaultLocalePrefixed: boolean,
): string {
	const cleanPath = path.replace(/^\/+/, "").replace(/\/+$/, "");
	if (!isDefaultLocalePrefixed && targetLocale === defaultLocale) {
		return cleanPath ? `/${cleanPath}` : "/";
	}
	return cleanPath ? `/${targetLocale}/${cleanPath}` : `/${targetLocale}`;
}

/**
 * Switch locale based on the current path
 * @param targetLocale The target language to switch to
 * @param path The current path
 * @param isDefaultLocalePrefixed Whether the default locale should be prefixed in the URL
 * @returns The new path with the target locale
 * @example changeLanguage('en', '/zh-tw/about') => '/en/about'
 * @example changeLanguage('zh-tw', '/about') => '/about'
 * @example changeLanguage('zh-tw', '/about', true) => '/zh-tw/about'
 */
export function changeLanguage(
	targetLocale: LanguageKey,
	path: string,
	isDefaultLocalePrefixed = prefixDefaultLocale,
): string {
	const languagePrefixes = Object.keys(languages);
	const cleanedPath = removeLanguagePrefix(path, languagePrefixes);
	return constructNewPath(targetLocale, cleanedPath, isDefaultLocalePrefixed);
}

// Get Locale code from slug
export function getLocaleCode(str: string) {
	const match = str.match(/^[a-z]{2}(-[a-z]{2})?/i);
	return match ? match[0] : null;
}
