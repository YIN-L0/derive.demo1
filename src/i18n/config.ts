export const LOCALES = ["en", "zh", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "derive.lang";

export const LOCALE_NAMES: Record<Locale, string> = { en: "EN", zh: "中文", fr: "FR" };
export const HTML_LANG: Record<Locale, string> = { en: "en", zh: "zh-Hans", fr: "fr" };

export const hasLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

/** Content in every supported language. A missing translation is an empty string, never English in disguise. */
export type Text = Record<Locale, string>;

/** Pick a language, falling back to English when a translation is missing. */
export const tr = (text: Partial<Text> | undefined, locale: Locale): string =>
  (text?.[locale] || text?.en || "").trim();

/** True when the requested language had to fall back to English. */
export const isFallback = (text: Partial<Text> | undefined, locale: Locale) =>
  locale !== "en" && !text?.[locale] && !!text?.en;
