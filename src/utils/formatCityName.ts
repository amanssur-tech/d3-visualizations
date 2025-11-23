//  src/utils/formatCityName.ts
/**
 * formatCityName
 * Shared city name normalizer for all case studies.
 * Handles Köln → Koeln, München → Muenchen, Düsseldorf → Duesseldorf,
 * while respecting translation fallbacks.
 */

import type { TranslateFn } from '../i18n/translate';

const CITY_NORMALIZATIONS: Record<string, string> = {
  Köln: 'Koeln',
  München: 'Muenchen',
  Düsseldorf: 'Duesseldorf',
};

const FALLBACKS: Record<string, string> = {
  Koeln: 'Köln',
  Muenchen: 'München',
  Duesseldorf: 'Düsseldorf',
};

export function formatCityNameFactory(translate: TranslateFn) {
  return function formatCityName(value: string): string {
    const normalized = CITY_NORMALIZATIONS[value] ?? value;
    const fallback = FALLBACKS[normalized] ?? value;
    const key = `charts.cityLabels.${normalized}`;
    return translate(key, { defaultValue: fallback });
  };
}
