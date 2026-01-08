// src/pages/CaseStudiesIndex.tsx
/**
 * CaseStudiesIndex.tsx lists every case study card with previews and tags for browsing.
 */
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import CaseStudyPreview from '../components/dashboard/CaseStudyPreview';
import { caseStudies } from '../content/caseStudies';
import { useTranslator } from '../hooks/useTranslator';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Surface } from '../ui/Surface';

import type { ReactElement } from 'react';

const CaseStudiesIndex = (): ReactElement => {
  const { translate } = useTranslator(['caseStudies', 'common']);

  /* ----------------------------- Page layout ----------------------------- */
  return (
    // Tweak: page spacing + animation for the case study library view.
    <motion.section
      className="mx-auto flex max-w-6xl flex-col gap-8"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Library hero copy */}
      <Surface variant="panel" padding="lg" className="sm:px-10">
        {/* Tweak: hero eyebrow/title/description copy for index intro lives here. */}
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          {translate('caseStudies.library.eyebrow')}
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
            {translate('caseStudies.library.title')}
          </h1>
        </div>
        <p className="mt-3 max-w-3xl text-base text-slate-600 dark:text-slate-300">
          {translate('caseStudies.library.description')}
        </p>
      </Surface>

      {/* Case study listing */}
      {/* Tweak: adjust grid columns/gaps to change card density. */}
      <div className="grid gap-6 lg:grid-cols-2">
        {caseStudies.map((study, index) => (
          <Surface
            as={motion.div}
            key={study.id}
            // Tweak: hover + entrance animation for each library card.
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            variant="panel"
            padding="lg"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                  {translate(study.subtitleKey)}
                </p>
                {/* Tweak: card headline + description text keys for each study. */}
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {translate(study.titleKey)}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {translate(study.descriptionKey)}
                </p>
              </div>
              {/* Tweak: CTA label + styling for each case study card. */}
              <Button as={Link} to={study.path} variant="secondary" size="sm" className="text-xs">
                {translate('caseStudies.library.cta')}
              </Button>
            </div>

            {/* Tweak: update tags per study to control category badges. */}
            <div className="mt-5 flex flex-wrap gap-2">
              {study.tags.map((tag) => (
                <Badge key={`${study.id}-${tag}`} size="sm">
                  {translate(`caseStudies.tags.${tag}`)}
                </Badge>
              ))}
            </div>

            <div className="mt-5">
              <CaseStudyPreview id={study.id} />
            </div>
          </Surface>
        ))}
      </div>
    </motion.section>
  );
};

export default CaseStudiesIndex;
