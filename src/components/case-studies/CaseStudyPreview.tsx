import { motion } from 'framer-motion';

import type { CaseStudyId } from '../../content/caseStudies';

interface CaseStudyPreviewProps {
  id: CaseStudyId;
}

const cardShell =
  'relative rounded-2xl border border-white/50 bg-white/70 p-4 shadow-inner shadow-slate-900/5 backdrop-blur dark:border-white/10 dark:bg-neutral-900/60';

const CaseStudyPreview = ({ id }: CaseStudyPreviewProps) => {
  if (id === 1) {
    return (
      <div className={`${cardShell} h-36 overflow-hidden`}>
        <div className="flex h-full items-end gap-2">
          {[50, 76, 62, 84, 58, 70].map((height, index) => (
            <motion.span
              key={height + index}
              className="flex-1 rounded-xl bg-gradient-to-t from-cyan-500/80 to-emerald-400/80 shadow shadow-cyan-500/30"
              style={{ height: `${height}%` }}
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
    return (
      <div className={`${cardShell} h-36 overflow-hidden`}>
        <svg viewBox="0 0 200 120" className="h-full w-full text-cyan-500">
          <defs>
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
    return (
      <div className={`${cardShell} h-36 overflow-hidden`}>
        <div className="relative flex h-full items-end gap-2">
          {[62, 48, 80, 44, 72, 68].map((height, index) => (
            <motion.span
              key={`${height}-${index}`}
              className="flex-1 rounded-lg bg-gradient-to-t from-emerald-500/80 to-cyan-500/80 shadow shadow-emerald-500/30"
              style={{ height: `${height}%` }}
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

  return (
    <div className={`${cardShell} h-36 overflow-hidden`}>
      <div className="relative grid h-full grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/70 bg-white/80 p-3 text-xs text-amber-700 shadow dark:border-white/10 dark:bg-white/5 dark:text-amber-200">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-200">
            Flawed
          </div>
          <div className="flex items-end gap-1">
            {[72, 48, 90].map((height, index) => (
              <span
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className="flex-1 rounded-lg bg-gradient-to-t from-amber-500/80 to-rose-400/80"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-emerald-100/80 bg-emerald-50/60 p-3 text-xs text-emerald-800 shadow-inner dark:border-emerald-200/20 dark:bg-emerald-400/10 dark:text-emerald-100">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-100">
            Fixed
          </div>
          <div className="flex items-end gap-1">
            {[82, 68, 74].map((height, index) => (
              <span
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className="flex-1 rounded-lg bg-gradient-to-t from-cyan-500/80 to-blue-500/80"
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
