/**
 * CaseStudyPreview.tsx renders small animated placeholders for each case study card in lists.
 * Each branch below mirrors the visual of a given case id using inline SVG or motion spans.
 */
import { motion } from 'framer-motion';

import type { CaseStudyId } from '../../content/caseStudies';
import type { ReactElement } from 'react';
export type { CaseStudyId } from '../../content/caseStudies';

interface CaseStudyPreviewProps {
  id: CaseStudyId;
}

// Tweak: shared preview card container styling (rounded glass base) used in each case snippet.
const cardShell =
  'relative rounded-2xl border border-white/50 bg-white/70 p-4 shadow-inner shadow-slate-900/5 backdrop-blur dark:border-white/10 dark:bg-neutral-900/60';

const CaseStudyPreview = ({ id }: CaseStudyPreviewProps): ReactElement => {
  /* ----------------------------- Case-specific mini previews ----------------------------- */
  if (id === 1) {
    // Simple static growth bars for the bar chart case
    const barHeights = [50, 76, 62, 84, 58, 70];
    return (
      <div className={`${cardShell} h-36 overflow-hidden`}>
        <div className="flex h-full items-end gap-2">
          {/* Tweak: adjust sample heights/count here to showcase different bar silhouettes. */}
          {barHeights.map((height, index) => (
            <motion.span
              key={`bar-${height}`}
              // Tweak: gradient palette + glow for this preview's bars.
              className="flex-1 rounded-xl bg-linear-to-t from-cyan-500/80 to-emerald-400/80 shadow shadow-cyan-500/30"
              style={{ height: `${height}%` }}
              // Tweak: entrance animation for preview bars.
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: index * 0.03, ease: 'easeOut' }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (id === 2) {
    // Dual line series hint at the time-series case
    return (
      <div className={`${cardShell} h-36 overflow-hidden`}>
        {/* Tweak: viewBox + polyline coordinates define the sparkline path. */}
        <svg viewBox="0 0 200 120" className="h-full w-full text-cyan-500">
          <defs>
            {/* Tweak: gradient stops for the hero line. */}
            <linearGradient id="lineCase" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <polyline
            points="10,90 45,70 80,60 115,55 150,40 185,30"
            fill="none"
            stroke="url(#lineCase)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <polyline
            points="10,95 45,86 80,78 115,74 150,69 185,65"
            fill="none"
            stroke="#22c55e"
            strokeWidth="6"
            strokeLinecap="round"
            opacity={0.8}
          />
        </svg>
      </div>
    );
  }

  if (id === 3) {
    // Animated bars to mimic the randomized experiment
    const randomizedHeights = [62, 48, 80, 44, 72, 68];
    return (
      <div className={`${cardShell} h-36 overflow-hidden`}>
        <div className="relative flex h-full items-end gap-2">
          {randomizedHeights.map((height, index) => (
            <motion.span
              key={`random-${height}`}
              // Tweak: animated bar palette + softness for randomized preview.
              className="flex-1 rounded-lg bg-linear-to-t from-emerald-500/80 to-cyan-500/80 shadow shadow-emerald-500/30"
              style={{ height: `${height}%` }}
              // Tweak: adjust pulsation duration/delay to change the jitter effect.
              animate={{ height: [`${height * 0.85}%`, `${height * 1.1}%`, `${height}%`] }}
              transition={{
                repeat: Infinity,
                repeatType: 'reverse',
                duration: 3,
                delay: index * 0.1,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (id === 5) {
    // Split panel showing a mini dumbbell + scatter hint for the dual view
    const dumbbellMarkerColors = ['#22c55e', '#6366f1', '#f97316'];
    const bubbleSizes = [1, 2, 3, 4];
    const getBubbleColor = (size: number) => {
      if (size % 2 === 0) return '#22c55e';
      if (size % 3 === 0) return '#f97316';
      return '#6366f1';
    };
    return (
      <div className={`${cardShell} h-36`}>
        <div className="grid h-full grid-cols-2 gap-3">
          <div className="flex flex-col justify-between rounded-xl border border-white/70 bg-white/80 p-3 shadow-inner dark:border-white/10 dark:bg-white/5">
            {dumbbellMarkerColors.map((color) => (
              <div key={color} className="relative flex items-center">
                <div className="h-0.5 flex-1 rounded bg-slate-200 dark:bg-slate-700" />
                <span className="absolute right-0 h-3 w-3 rounded-full bg-sky-400 shadow shadow-sky-500/30" />
                <span
                  className="absolute left-0 h-2.5 w-2.5 rounded-full shadow"
                  style={{ background: color }}
                />
              </div>
            ))}
          </div>
          <div className="relative rounded-xl border border-white/70 bg-white/80 p-3 shadow-inner dark:border-white/10 dark:bg-white/5">
            {bubbleSizes.map((size) => (
              <span
                key={`bubble-${size}`}
                className="absolute inline-flex items-center justify-center rounded-full text-[10px] font-semibold text-white shadow"
                style={{
                  width: `${14 + size * 5}px`,
                  height: `${14 + size * 5}px`,
                  left: `${size * 14 + 10}px`,
                  bottom: `${size * 8 + 8}px`,
                  background: getBubbleColor(size),
                }}
              >
                {size + 1}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (id === 6) {
    // Parallel coordinates hint with intersecting station paths
    const previewLines: [string, number[]][] = [
      ['#22c55e', [80, 64, 70, 62, 76]],
      ['#0ea5e9', [52, 78, 66, 58, 48]],
      ['#a855f7', [70, 50, 84, 46, 68]],
      ['#f97316', [60, 58, 72, 78, 54]],
    ];

    return (
      <div className={`${cardShell} h-36`}>
        <div className="relative h-full w-full rounded-xl border border-white/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
          <div className="absolute inset-x-2 top-3 bottom-3 flex justify-between">
            {[0, 1, 2, 3, 4].map((axis) => (
              <span
                key={`axis-${axis}`}
                className="h-full w-px rounded bg-slate-200 dark:bg-slate-800"
                style={{ opacity: axis === 0 || axis === 4 ? 0.6 : 0.35 }}
              />
            ))}
          </div>
          {previewLines.map((line, lineIndex) => {
            const [color, heights] = line;
            return (
              <svg key={color} viewBox="0 0 200 120" className="absolute inset-2">
                <polyline
                  points={heights
                    .map((value, axis) => `${10 + axis * 45},${120 - value}`)
                    .join(' ')}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity={0.82 - lineIndex * 0.12}
                />
              </svg>
            );
          })}
        </div>
      </div>
    );
  }

  // Default fallback references the flawed/fixed comparison
  return (
    <div className={`${cardShell} h-36 overflow-hidden`}>
      <div className="relative grid h-full grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/70 bg-white/80 p-3 text-xs text-amber-700 shadow dark:border-white/10 dark:bg-white/5 dark:text-amber-200">
          {/* Tweak: label text for the flawed tile. */}
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-200">
            Flawed
          </div>
          <div className="flex items-end gap-1">
            {/* Tweak: flawed sample heights + palette illustrate intentionally weak design. */}
            {[72, 48, 90].map((height) => (
              <span
                key={`flawed-${height}`}
                className="flex-1 rounded-lg bg-linear-to-t from-amber-500/80 to-rose-400/80"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-emerald-100/80 bg-emerald-50/60 p-3 text-xs text-emerald-800 shadow-inner dark:border-emerald-200/20 dark:bg-emerald-400/10 dark:text-emerald-100">
          {/* Tweak: label text for the fixed tile. */}
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-100">
            Fixed
          </div>
          <div className="flex items-end gap-1">
            {/* Tweak: fixed variant heights + colors showing improved state. */}
            {[82, 68, 74].map((height) => (
              <span
                key={`fixed-${height}`}
                className="flex-1 rounded-lg bg-linear-to-t from-cyan-500/80 to-blue-500/80"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyPreview;
