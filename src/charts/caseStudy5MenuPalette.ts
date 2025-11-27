// src/charts/caseStudy5MenuPalette.ts
/**
 * Defines a centralized palette for Case Study 5 menu types so both the dumbbell
 * and scatter/bubble renderers can stay in sync. Adjust the colors below to update
 * the entire case study at once (legend, dots, tooltips, etc.).
 */

export type CaseStudy5MenuType = 'Veggie' | 'Hähnchen' | 'Kalb' | (string & {});

// Tweak: update fallback hues here to shift the Veggie/Hähnchen/Kalb encoding.
export const CASE_STUDY_5_MENU_COLORS: Record<string, string> = {
  Veggie: '#22a884', // viridis green
  Hähnchen: '#fde725', // viridis lime
  Kalb: '#6366f1', // viridis indigo
};

// Ordered list used by the legend so menu types stay in the same sequence everywhere.
export const CASE_STUDY_5_MENU_ORDER: CaseStudy5MenuType[] = ['Veggie', 'Hähnchen', 'Kalb'];

export const getMenuColor = (menuType: string) => CASE_STUDY_5_MENU_COLORS[menuType] ?? '#94a3b8';
