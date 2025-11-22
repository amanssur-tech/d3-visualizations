import type en from './locales/en.json';

type Primitive = string | number | boolean | null | undefined;

type NestedKeys<T> = T extends Primitive
  ? never
  : {
      [K in keyof T & (string | number)]: T[K] extends Primitive
        ? `${K}`
        : `${K}` | `${K}.${Extract<keyof T[K], string | number>}`;
    }[keyof T & (string | number)];

export type TranslationResources = typeof en;
export type TranslationNamespaces = keyof TranslationResources;
export type TranslationKeys = NestedKeys<TranslationResources>;

export const supportedLanguages = ['en', 'de'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: TranslationResources;
  }
}
