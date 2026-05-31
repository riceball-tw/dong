import enTranslation from "./en.json";
import zhCnTranslation from "./zh-cn.json";
import zhTwTranslation from "./zh-tw.json";

export const languages = {
	en: "English",
	"zh-cn": "简体中文",
	"zh-tw": "繁體中文",
} as const;

export const defaultLocale = "en";
export const prefixDefaultLocale = true;

export type LanguageKey = keyof typeof languages;
export type LanguageValue = (typeof languages)[LanguageKey];
export type TranslationKey = keyof typeof enTranslation;

export function isLanguageKey(key: string | undefined): key is LanguageKey {
	return key !== undefined && key in languages;
}

/**
 * Safely convert Astro.currentLocale to LanguageKey with fallback
 * @example getLocale(Astro.currentLocale)
 */
export function getLocale(locale: string | undefined): LanguageKey {
	return isLanguageKey(locale) ? locale : defaultLocale;
}

/**
 * Get the translation file based on the target language
 * If the target language is not found, it will fallback to English
 */
export const getTranslationFile = (targetLocale: LanguageKey) => {
	if (targetLocale === "en") return enTranslation;
	if (targetLocale === "zh-cn") return zhCnTranslation;
	if (targetLocale === "zh-tw") return zhTwTranslation;
	return enTranslation;
};

/**
 * Generate translation function based on the target language
 * If the translation is not found in the target language, it will fallback to English
 * @example const t = useTranslations('zh-tw')
 * @example t('tired_game_husky_sew', { number: 5 }) => '所有文章共 5 篇'
 */
export function useTranslations(targetLanguage?: LanguageKey) {
	return function t(
		key: keyof typeof enTranslation,
		params?: Record<string, string | number>,
	) {
		const translation = getTranslationFile(targetLanguage ?? defaultLocale)?.[
			key
		];

		if (!translation && translation !== "") {
			return getTranslationFile(defaultLocale)?.[key] ?? key;
		}

		/**
		 * Replace the {} placeholders with the actual values
		 */
		if (params) {
			return Object.entries(params).reduce(
				(acc, [paramKey, paramValue]) =>
					acc.replace(new RegExp(`{${paramKey}}`, "g"), String(paramValue)),
				translation,
			);
		}

		return translation;
	};
}
