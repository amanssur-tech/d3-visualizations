// src/i18n/translate.ts
/**
 * Standardizes translation behavior across the app.
 * It allows components to call translate("navbar.logoAlt") or translate("common.ok")
 * without manually specifying namespaces each time.
 *
 * Usage in components:
 *   import { createTranslator } from '../i18n/translate';
 *   const { t, i18n } = useTranslation(['navbar','common', ...]);
 *   const translate = createTranslator(t);
 */

import type { Namespace, TFunction } from 'i18next';

export const KNOWN_NAMESPACES = [
  'common',
  'navbar',
  'footer',
  'dashboard',
  'charts',
  'export',
  'tooltips',
  'caseStudies',
] as const;

export type TranslateOptions = Record<string, unknown>;
export type TranslateFn = (key: string, options?: TranslateOptions) => string;
export type AppNamespace = (typeof KNOWN_NAMESPACES)[number];
type RawTFunction = (key: string, options?: TranslateOptions) => string;

export const createTranslator = <Ns extends Namespace>(t: TFunction<Ns>): TranslateFn => {
  const rawT = t as unknown as RawTFunction;

  return (fullKey: string, options?: TranslateOptions): string => {
    const [maybeNs, ...rest] = fullKey.split('.');

    if (maybeNs && rest.length > 0 && (KNOWN_NAMESPACES as readonly string[]).includes(maybeNs)) {
      const key = rest.join('.');
      const finalOptions: TranslateOptions = {
        ...(options ?? {}),
        ns: maybeNs,
      };
      return rawT(key, finalOptions);
    }

    return rawT(fullKey, options);
  };
};
