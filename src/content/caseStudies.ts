export type CaseStudyId = 1 | 2 | 3 | 4 | 5 | 6;

export interface CaseStudyMeta {
  id: CaseStudyId;
  slug: string;
  path: string;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  tags: string[];
  accentFrom: string;
  accentTo: string;
  preview: 'bar' | 'line' | 'random' | 'time' | 'dual' | 'parallel';
}

// Tweak: central metadata registry for every case study (paths, copy keys, tags, preview style).
export const caseStudies: CaseStudyMeta[] = [
  {
    id: 1,
    slug: '1-bar-chart-city-comparison',
    path: '/case-studies/1-bar-chart-city-comparison',
    titleKey: 'caseStudies.1.title',
    subtitleKey: 'caseStudies.1.subtitle',
    descriptionKey: 'caseStudies.1.description',
    tags: ['barChart', 'cityComparison', 'exportable'],
    // Tweak: gradient classes powering carousel/index backgrounds per study.
    accentFrom: 'from-cyan-500/20',
    accentTo: 'to-emerald-500/20',
    preview: 'bar',
  },
  {
    id: 2,
    slug: '2-line-chart-city-trends',
    path: '/case-studies/2-line-chart-city-trends',
    titleKey: 'caseStudies.2.title',
    subtitleKey: 'caseStudies.2.subtitle',
    descriptionKey: 'caseStudies.2.description',
    tags: ['lineChart', 'timeSeries', 'cityComparison', 'exportable'],
    accentFrom: 'from-blue-500/20',
    accentTo: 'to-indigo-500/20',
    preview: 'line',
  },
  {
    id: 3,
    slug: '3-randomized-bar-variation',
    path: '/case-studies/3-randomized-bar-variation',
    titleKey: 'caseStudies.3.title',
    subtitleKey: 'caseStudies.3.subtitle',
    descriptionKey: 'caseStudies.3.description',
    tags: ['barChart', 'randomized', 'live'],
    accentFrom: 'from-emerald-500/20',
    accentTo: 'to-cyan-500/20',
    preview: 'random',
  },
  {
    id: 4,
    slug: '4-time-of-day-sales-flawed-corrected',
    path: '/case-studies/4-time-of-day-sales-flawed-corrected',
    titleKey: 'caseStudies.4.title',
    subtitleKey: 'caseStudies.4.subtitle',
    descriptionKey: 'caseStudies.4.description',
    tags: ['ethics', 'design', 'timeOfDay', 'multiPanel'],
    accentFrom: 'from-amber-500/20',
    accentTo: 'to-rose-500/20',
    preview: 'time',
  },
  {
    id: 5,
    slug: '5-dual-dumbbell-bubble-city-story',
    path: '/case-studies/5-dual-dumbbell-bubble-city-story',
    titleKey: 'caseStudies.5.title',
    subtitleKey: 'caseStudies.5.subtitle',
    descriptionKey: 'caseStudies.5.description',
    tags: ['cityComparison', 'dualView', 'dumbbell', 'scatterplot'],
    accentFrom: 'from-fuchsia-500/20',
    accentTo: 'to-cyan-500/20',
    preview: 'dual',
  },
  {
    id: 6,
    slug: '6-parallel-coordinates-air-quality',
    path: '/case-studies/6-parallel-coordinates-air-quality',
    titleKey: 'caseStudies.6.title',
    subtitleKey: 'caseStudies.6.subtitle',
    descriptionKey: 'caseStudies.6.description',
    tags: ['parallelCoordinates', 'airQuality', 'multiMetric'],
    accentFrom: 'from-emerald-500/20',
    accentTo: 'to-sky-500/20',
    preview: 'parallel',
  },
];

export const caseStudyById = new Map(caseStudies.map((study) => [study.id, study]));
export const caseStudyBySlug = new Map(caseStudies.map((study) => [study.slug, study]));
export const caseStudiesBasePath = '/case-studies';
