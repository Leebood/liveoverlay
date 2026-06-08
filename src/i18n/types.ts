export type Locale = 'zh' | 'en';

export const locales: Locale[] = ['en', 'zh'];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
};

export type TranslationKeys = Record<string, string>;
