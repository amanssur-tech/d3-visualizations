// src/pages/Dashboard.tsx
/**
 * Dashboard.tsx is the landing page shell that highlights hero copy, featured case studies,
 * methodology blurbs, tooling stats, and the contact call-to-action.
 */
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import DashboardCarousel from '../components/dashboard/DashboardCarousel';
import DashboardSection from '../components/dashboard/DashboardSection';
import { caseStudies } from '../content/caseStudies';
import { useTranslator } from '../hooks/useTranslator';
import { Button } from '../ui/Button';
import { Surface } from '../ui/Surface';

import type { ReactElement } from 'react';

// Tweak: add/remove methodology cards by editing this key list.
const methodologyKeys = ['ethics', 'perception', 'design'] as const;

// Tweak: tool highlight tiles—each entry pairs with translation keys + color classes.
const toolBadges = [
  { key: 'd3', color: 'bg-orange-500' },
  { key: 'react', color: 'bg-sky-500' },
  { key: 'tailwind', color: 'bg-teal-500' },
  { key: 'vite', color: 'bg-purple-500' },
] as const;

const Dashboard = (): ReactElement => {
  const { translate } = useTranslator(['dashboard', 'caseStudies', 'common']);
  const featured = caseStudies;

  /* ----------------------------- Page sections ----------------------------- */
  return (
    // Tweak: landing page vertical spacing + fade-in animation for the dashboard shell.
    <motion.div
      className="mx-auto flex max-w-6xl flex-col gap-10"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Hero section introducing the project */}
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
          {/* Tweak: hero eyebrow + headline/description copy. */}
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
            {/* Tweak: hero CTA labels + destinations. */}
            <Button as={Link} to="/case-studies">
              {translate('dashboard.hero.primaryCta')}
            </Button>
            <Button as={Link} to={featured[0]?.path ?? '/case-studies'} variant="secondary">
              {translate('dashboard.hero.secondaryCta')}
            </Button>
          </div>
        </div>
      </Surface>

      {/* Featured case studies carousel */}
      <section className="space-y-3">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {translate('dashboard.featured.title')}
          </h2>
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
        <DashboardCarousel featured={featured} translate={translate} />
      </section>

      {/* Methodology highlights */}
      {/* Tweak: change `md:grid-cols-3` or gap sizes to reflow methodology highlights. */}
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

      {/* Tool stack callouts */}
      <DashboardSection
        eyebrow={translate('dashboard.tools.description')}
        title={translate('dashboard.tools.title')}
        action={
          <Button as={Link} to="/case-studies" variant="secondary" size="sm" className="text-xs">
            {translate('caseStudies:library.viewAll')}
          </Button>
        }
      >
        {/* Tweak: tool badge grid density and className to show more/less columns. */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {toolBadges.map((tool) => (
            <Surface
              variant="muted"
              padding="xs"
              key={tool.key}
              className="flex items-center justify-between"
            >
              {/* Tweak: change `tool.color` classes for different badge swatches. */}
              <div className={`h-10 w-10 rounded-xl ${tool.color} shadow-lg`} />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {translate(`dashboard.tools.items.${tool.key}`)}
              </span>
            </Surface>
          ))}
        </div>
      </DashboardSection>

      {/* Contact call-to-action */}
      <DashboardSection
        eyebrow={translate('dashboard.contact.title')}
        action={
          // Tweak: contact CTA destination + label for dashboard finale.
          <Button href={translate('dashboard.contact.url')} target="_blank" rel="noreferrer" as="a">
            {translate('dashboard.contact.cta')}
          </Button>
        }
      >
        <div />
      </DashboardSection>
    </motion.div>
  );
};

export default Dashboard;
