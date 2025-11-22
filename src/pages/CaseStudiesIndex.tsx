import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import CaseStudyPreview from '../components/case-studies/CaseStudyPreview';
import { caseStudies } from '../content/caseStudies';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Surface } from '../ui/Surface';

const knownNamespaces = [
  'common',
  'navbar',
  'footer',
  'dashboard',
  'charts',
  'export',
  'tooltips',
  'caseStudies',
] as const;

const CaseStudiesIndex = () => {
  const { t } = useTranslation(['caseStudies', 'common']);
  const translate = (fullKey: string, options?: Record<string, unknown>): string => {
    const [maybeNs, ...rest] = fullKey.split('.');
    if (maybeNs && rest.length > 0 && (knownNamespaces as readonly string[]).includes(maybeNs)) {
      const key = rest.join('.');
      return t(key, { ns: maybeNs, ...(options ?? {}) });
    }
    return t(fullKey, options);
  };

  return (
    <motion.section
      className="mx-auto flex max-w-6xl flex-col gap-8"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Surface variant="panel" padding="lg" className="sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          {t('caseStudies:library.eyebrow')}
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
            {t('caseStudies:library.title')}
          </h1>
        </div>
        <p className="mt-3 max-w-3xl text-base text-slate-600 dark:text-slate-300">
          {t('caseStudies:library.description')}
        </p>
      </Surface>

      <div className="grid gap-6 lg:grid-cols-2">
        {caseStudies.map((study, index) => (
          <Surface
            as={motion.div}
            key={study.id}
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
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {translate(study.titleKey)}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {translate(study.descriptionKey)}
                </p>
              </div>
              <Button as={Link} to={study.path} variant="secondary" size="sm" className="text-xs">
                {t('caseStudies:library.cta')}
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {study.tags.map((tag) => (
                <Badge
                  key={`${study.id}-${tag}`}
                  size="sm"
                >
                  {t(`caseStudies:tags.${tag}`)}
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
