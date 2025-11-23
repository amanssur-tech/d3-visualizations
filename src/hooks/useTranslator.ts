// src/hooks/useTranslator.ts
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { type AppNamespace, createTranslator, type TranslateFn } from '../i18n/translate';

type HookNamespaces = Parameters<typeof useTranslation>[0];
type HookOptions = Parameters<typeof useTranslation>[1];

type NamespacesArg = AppNamespace | readonly AppNamespace[];
type TranslatorResponse = {
  translate: TranslateFn;
} & ReturnType<typeof useTranslation>;

export function useTranslator(
  namespaces?: NamespacesArg,
  options?: HookOptions
): TranslatorResponse {
  const response = useTranslation(namespaces as HookNamespaces, options);
  const translate = useMemo(() => createTranslator(response.t), [response.t]);

  return {
    ...response,
    translate,
  } as TranslatorResponse;
}
