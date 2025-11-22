import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import CaseStudyPreview from './case-studies/CaseStudyPreview';
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

const methodologyKeys = ['ethics', 'perception', 'design'] as const;

const toolBadges = [
  { key: 'd3', color: 'bg-orange-500' },
  { key: 'react', color: 'bg-sky-500' },
  { key: 'tailwind', color: 'bg-teal-500' },
  { key: 'vite', color: 'bg-purple-500' },
] as const;

const Dashboard = () => {
  const { t } = useTranslation(['dashboard', 'caseStudies', 'common']);

  const featured = useMemo(() => caseStudies, []);

  const translate = (fullKey: string, options?: Record<string, unknown>): string => {
    const [maybeNs, ...rest] = fullKey.split('.');
    if (maybeNs && rest.length > 0 && (knownNamespaces as readonly string[]).includes(maybeNs)) {
      const key = rest.join('.');
      return t(key, { ns: maybeNs, ...(options ?? {}) });
    }
    return t(fullKey, options);
  };

  return (
    <motion.div
      className="mx-auto flex max-w-6xl flex-col gap-10"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Surface
        as={motion.section}
        variant="panel"
        padding="xl"
        elevated
        className="overflow-hidden sm:px-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="relative space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
            {translate('dashboard.hero.eyebrow')}
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
            {translate('dashboard.hero.title')}
          </h1>
          <p className="max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            {translate('dashboard.hero.description')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button as={Link} to="/case-studies">
              {translate('dashboard.hero.primaryCta')}
            </Button>
            <Button
              as={Link}
              to={featured[0]?.path ?? '/case-studies'}
              variant="secondary"
            >
              {translate('dashboard.hero.secondaryCta')}
            </Button>
          </div>
        </div>
      </Surface>

      <section className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {translate('dashboard.featured.title')}
            </h2>
          </div>
          <Button
            as={Link}
            to="/case-studies"
            variant="secondary"
            size="sm"
            className="hidden text-xs sm:inline-flex"
          >
            {translate('common.actions.viewLibrary')}
          </Button>
        </div>
        <div className="group relative -mx-4 overflow-x-auto px-4">
          <div className="flex min-w-full gap-4 pb-2 md:gap-6">
            {featured.map((study, index) => (
              <Link
                key={study.id}
                to={study.path}
                className="block flex-none focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
              >
                <Surface
                  as={motion.div}
                  variant="panel"
                  padding="md"
                  className="w-[310px] flex-none transition hover:-translate-y-1"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                        {translate(study.subtitleKey)}
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {translate(study.titleKey)}
                      </h3>
                    </div>
                    <Badge variant="soft" size="xs">
                      {study.id}
                    </Badge>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
                    {translate(study.descriptionKey)}
                  </p>
                  <div className="mt-4">
                    <CaseStudyPreview id={study.id} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {study.tags.map((tag) => (
                      <Badge
                        key={`${study.slug}-${tag}`}
                        size="xs"
                      >
                        {translate(`caseStudies:tags.${tag}`)}
                      </Badge>
                    ))}
                  </div>
                </Surface>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="methodology" className="grid gap-4 md:grid-cols-3">
        {methodologyKeys.map((key, index) => (
          <Surface
            as={motion.div}
            key={key}
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 + index * 0.05 }}
            variant="card"
            padding="md"
            className="text-sm"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
              {translate(`dashboard.methodology.items.${key}.title`)}
            </p>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              {translate(`dashboard.methodology.items.${key}.description`)}
            </p>
          </Surface>
        ))}
      </section>

      <Surface as="section" variant="panel" padding="lg" className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
              {translate('dashboard.tools.description')}
            </p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {translate('dashboard.tools.title')}
            </h2>
          </div>
          <Button
            as={Link}
            to="/case-studies"
            variant="secondary"
            size="sm"
            className="text-xs"
          >
            {translate('caseStudies:library.viewAll')}
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {toolBadges.map((tool) => (
            <Surface
              variant="muted"
              padding="xs"
              key={tool.key}
              className="flex items-center justify-between"
            >
              <div className={`h-10 w-10 rounded-xl ${tool.color} shadow-lg`} />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {translate(`dashboard.tools.items.${tool.key}`)}
              </span>
            </Surface>
          ))}
        </div>
      </Surface>

      <Surface
        as={motion.section}
        variant="panel"
        padding="lg"
        elevated
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
              {translate('dashboard.contact.title')}
            </p>
          </div>
          <Button
            href={translate('dashboard.contact.url')}
            target="_blank"
            rel="noreferrer"
            as="a"
          >
            {translate('dashboard.contact.cta')}
          </Button>
        </div>
      </Surface>
    </motion.div>
  );
};

export default Dashboard;
