/**
 * NotFound.tsx renders the fallback page for unknown routes,
 * offering a CTA home button and a contextual "go back" action.
 */
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';

import { Button } from '../ui/Button';

const NotFound = () => {
  const { t } = useTranslation('notFound');
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      void navigate(-1);
      return;
    }
    void navigate('/');
  };

  /* ----------------------------- Layout + actions ----------------------------- */
  return (
    // Tweak: container styling + blur/backdrop for 404 card lives here.
    <motion.section
      className="relative mx-auto flex w-full max-w-3xl flex-col items-center overflow-hidden rounded-4xl border border-white/50 bg-white/80 px-6 py-12 text-center shadow-2xl shadow-cyan-500/10 backdrop-blur dark:border-white/10 dark:bg-neutral-900/70 dark:shadow-black/40 sm:px-10 sm:py-16"
      // Tweak: entrance animation if you want the 404 page to ease differently.
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Tweak: eyebrow + hero copy for not-found page is sourced here. */}
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-500 dark:text-teal-300">
        {t('eyebrow')}
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
        {t('title')}
      </h1>
      <p className="mt-4 max-w-xl text-base text-slate-500 dark:text-slate-400">
        {t('description')}
      </p>
      {/* Tweak: change CTA layout/gap here if two buttons shouldn't stack. */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button as={NavLink} to="/" size="sm">
          {/* Tweak: primary CTA text + destination for 404 recovery. */}
          {t('cta')}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={handleBack}>
          {/* Tweak: secondary action label hooking back navigation. */}
          {t('secondary')}
        </Button>
      </div>
    </motion.section>
  );
};

export default NotFound;
