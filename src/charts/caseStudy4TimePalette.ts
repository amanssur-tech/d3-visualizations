// src/charts/caseStudy4TimePalette.ts
/**
 * Shared palette for time-of-day encodings in Case Study 4.
 * Matches the warm hues already used by the flawed donut + labels.
 */

import type { TimeOfDay } from '../hooks/useTimeOfDayData';

export const caseStudy4TimePalette: Record<TimeOfDay, string> = {
  morgens: '#440154', // viridis deep purple
  mittags: '#21908d', // viridis teal
  abends: '#fde725', // viridis lime
};
