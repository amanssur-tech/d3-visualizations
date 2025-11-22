import i18n from 'i18next';
import Cookies from 'js-cookie';
import { initReactI18next } from 'react-i18next';

import de from './locales/de.json';
import en from './locales/en.json';
import { supportedLanguages, type SupportedLanguage } from './types';

export const LANG_COOKIE = 'lang';

const isSupportedLanguage = (lang?: string): lang is SupportedLanguage =>
  typeof lang === 'string' && (supportedLanguages as readonly string[]).includes(lang);

const detectLanguage = (): SupportedLanguage => {
  if (typeof document !== 'undefined') {
    const cookieLang = Cookies.get(LANG_COOKIE);
    if (isSupportedLanguage(cookieLang)) {
      return cookieLang;
    }
  }

  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language?.toLowerCase() ?? '';
    if (browserLang.startsWith('de')) {
      return 'de';
    }
  }

  return 'en';
};

const initialLanguage = detectLanguage();

if (typeof document !== 'undefined') {
  Cookies.set(LANG_COOKIE, initialLanguage, { expires: 365, sameSite: 'lax' });
}

void i18n.use(initReactI18next).init({
  resources: {
    en,
    de,
  },
  lng: initialLanguage,
  fallbackLng: 'en',
  supportedLngs: supportedLanguages,
  defaultNS: 'common',
  returnNull: false,
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  if (typeof document === 'undefined') return;
  if (isSupportedLanguage(lng)) {
    Cookies.set(LANG_COOKIE, lng, { expires: 365, sameSite: 'lax' });
  }
});

export { isSupportedLanguage };
export default i18n;
