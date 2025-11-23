// src/charts/caseStudy4Palette.ts
/**
 * Defines a consistent color palette for the two cities in Case Study 4.
 * Uses CSS variables if defined, otherwise falls back to hardcoded colors.
 */

import { cssVar } from '../theme/chartTheme';
import { chartConfig } from '../utils/config';

// Tweak: fallback hex values if CSS variables are missing.
const fallbackCaseStudy4Palette = {
  Berlin: '#3b528b',
  Köln: '#7ad151',
} as const;

// Shared palette for every Case Study 4 chart; adjust these to propagate new brand colors everywhere.
export const caseStudy4Palette: Record<string, string> = {
  Berlin: chartConfig.cityColors.Berlin
    ? cssVar(chartConfig.cityColors.Berlin)
    : fallbackCaseStudy4Palette.Berlin,
  Köln: chartConfig.cityColors['Köln']
    ? cssVar(chartConfig.cityColors['Köln'])
    : fallbackCaseStudy4Palette.Köln,
};
