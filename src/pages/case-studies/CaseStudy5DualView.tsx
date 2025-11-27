// src/pages/case-studies/CaseStudy5DualView.tsx
/**
 * CaseStudy5DualView.tsx renders the fifth case study page that toggles between
 * a dumbbell comparison and a scatter/bubble plot. Sections are grouped into:
 *  - translations + helpers
 *  - data loading
 *  - D3 renderer orchestration
 *  - toggle + content layout
 * Every box contains comments so future edits can quickly adjust copy, layout, or charts.
 */

import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  renderCaseStudy5Dumbbell,
  type CaseStudy5Datum,
} from '../../charts/CaseStudy5DumbbellRenderer';
import {
  CASE_STUDY_5_MENU_COLORS,
  CASE_STUDY_5_MENU_ORDER,
} from '../../charts/caseStudy5MenuPalette';
import { renderCaseStudy5Scatter } from '../../charts/CaseStudy5ScatterRenderer';
import rawData from '../../data/case-study05.json';
import { useTranslator } from '../../hooks/useTranslator';
import { formatCityNameFactory } from '../../utils/formatCityName';

type ViewMode = 'dumbbell' | 'scatter';

interface CaseStudy5RawEntry {
  Stadt: string;
  Kebabläden: number;
  'Kunden pro Tag': number;
  'Umsatz pro Tag': number;
  'Meistverkaufter Kebab': string;
}

const mapDataEntry = (entry: CaseStudy5RawEntry): CaseStudy5Datum => ({
  city: entry.Stadt,
  shops: entry['Kebabläden'],
  customersPerDay: entry['Kunden pro Tag'],
  revenuePerDay: entry['Umsatz pro Tag'],
  menuType: entry['Meistverkaufter Kebab'],
});

const DUMBELL_NOTES = ['channels', 'labels', 'shops'] as const;
const SCATTER_NOTES = ['quadrants', 'legend', 'annotation'] as const;

const CaseStudy5DualView = () => {
  const { translate } = useTranslator(['caseStudies', 'common']);
  const formatCityName = useMemo(() => formatCityNameFactory(translate), [translate]);
  const formatMenuType = useCallback(
    (menu: string) =>
      translate(`caseStudies:5.menuTypes.${menu}`, {
        defaultValue: menu,
      }),
    [translate]
  );

  const [data, setData] = useState<CaseStudy5Datum[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dumbbell');

  const dumbbellRef = useRef<HTMLDivElement | null>(null);
  const scatterRef = useRef<HTMLDivElement | null>(null);

  /* ----------------------------- Data load ----------------------------- */
  useEffect(() => {
    try {
      const parsed = (rawData as CaseStudy5RawEntry[]).map(mapDataEntry);
      setData(parsed);
      setErrorKey(null);
    } catch (error) {
      console.error('Failed to parse Case Study 5 data', error);
      setErrorKey('common.errors.unknown');
    } finally {
      setLoading(false);
    }
  }, []);

  /* ----------------------------- Chart orchestration ----------------------------- */
  useEffect(() => {
    if (!data.length || !dumbbellRef.current) return undefined;
    const cleanup = renderCaseStudy5Dumbbell({
      container: dumbbellRef.current,
      data,
      translate,
      formatCityName,
      formatMenuType,
    });
    return cleanup;
  }, [data, formatCityName, formatMenuType, translate]);

  useEffect(() => {
    if (!data.length || !scatterRef.current) return undefined;
    const cleanup = renderCaseStudy5Scatter({
      container: scatterRef.current,
      data,
      translate,
      formatCityName,
      formatMenuType,
    });
    return cleanup;
  }, [data, formatCityName, formatMenuType, translate]);

  const dumbbellNotes = useMemo(
    () => DUMBELL_NOTES.map((key) => translate(`caseStudies:5.dumbbell.notes.${key}`)),
    [translate]
  );
  const scatterNotes = useMemo(
    () => SCATTER_NOTES.map((key) => translate(`caseStudies:5.scatter.notes.${key}`)),
    [translate]
  );

  /* ----------------------------- Page layout ----------------------------- */
  return (
    <motion.section
      className="mx-auto w-full max-w-5xl space-y-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Hero intro copy */}
      <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
          {translate('caseStudies:5.subtitle')}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
          {translate('caseStudies:5.title')}
        </h1>
        <p className="mt-4 max-w-3xl text-base text-slate-600 dark:text-slate-300">
          {translate('caseStudies:5.description')}
        </p>
      </div>

      <div className="space-y-6">
        {/* Toggle + dual-view canvas */}
        <div className="rounded-2xl border border-white/50 bg-white/80 px-4 py-6 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-700 dark:text-cyan-200">
                {translate('caseStudies:5.toggle.label')}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                {translate(
                  viewMode === 'dumbbell'
                    ? 'caseStudies:5.dumbbell.title'
                    : 'caseStudies:5.scatter.title'
                )}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {translate(
                  viewMode === 'dumbbell'
                    ? 'caseStudies:5.dumbbell.description'
                    : 'caseStudies:5.scatter.description'
                )}
              </p>
            </div>
            <div
              className="inline-flex items-center gap-1 rounded-full border border-slate-200/70 bg-white/70 p-1 text-xs font-semibold text-slate-600 shadow-sm shadow-slate-200/60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:shadow-black/40"
              role="group"
              aria-label={translate('caseStudies:5.toggle.aria')}
            >
              {(['dumbbell', 'scatter'] as const).map((mode) => {
                const isActive = viewMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => !isActive && setViewMode(mode)}
                    className={`inline-flex items-center rounded-full px-3 py-1 transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-sm shadow-cyan-500/25 ring-1 ring-cyan-200/60 dark:bg-neutral-900 dark:text-white dark:shadow-cyan-500/30 dark:ring-cyan-400/40'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                    aria-pressed={isActive}
                  >
                    {translate(`caseStudies:5.toggle.${mode}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 relative min-h-[400px] rounded-2xl border border-white/50 bg-linear-to-b from-white/85 to-white/60 p-6 pl-0 pr-35 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent">
            {errorKey ? (
              <p className="rounded-xl bg-rose-50/70 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
                {translate(errorKey)}
              </p>
            ) : (
              <>
                <div
                  ref={dumbbellRef}
                  className={`${viewMode === 'dumbbell' ? 'block' : 'hidden'} ${
                    loading ? 'animate-pulse opacity-80' : ''
                  }`}
                  aria-hidden={viewMode !== 'dumbbell'}
                />
                <div
                  ref={scatterRef}
                  className={`${viewMode === 'scatter' ? 'block' : 'hidden'} ${
                    loading ? 'animate-pulse opacity-80' : ''
                  }`}
                  aria-hidden={viewMode !== 'scatter'}
                />
              </>
            )}

            <div className="absolute inset-y-10 right-6 flex w-32 flex-col gap-2 text-sm text-slate-600 dark:text-slate-200">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                {translate('caseStudies:5.legend.menu')}
              </p>
              {CASE_STUDY_5_MENU_ORDER.map((menu) => (
                <span key={menu} className="inline-flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: CASE_STUDY_5_MENU_COLORS[menu] }}
                  />
                  {formatMenuType(menu)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Narrative cards for each view */}
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/50 bg-white/80 p-5 text-sm text-slate-600 shadow-md dark:border-white/10 dark:bg-neutral-950/60 dark:text-slate-200">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-700 dark:text-emerald-200">
              {translate('caseStudies:5.dumbbell.label')}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
              {translate('caseStudies:5.dumbbell.title')}
            </h3>
            <p className="mt-2 text-sm">{translate('caseStudies:5.dumbbell.description')}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5">
              {dumbbellNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/50 bg-white/80 p-5 text-sm text-slate-600 shadow-md dark:border-white/10 dark:bg-neutral-950/60 dark:text-slate-200">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-700 dark:text-sky-200">
              {translate('caseStudies:5.scatter.label')}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
              {translate('caseStudies:5.scatter.title')}
            </h3>
            <p className="mt-2 text-sm">{translate('caseStudies:5.scatter.description')}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5">
              {scatterNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CaseStudy5DualView;
