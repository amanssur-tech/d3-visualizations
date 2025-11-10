import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const primaryButton =
  'inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl';
const ghostButton =
  'inline-flex items-center justify-center rounded-2xl border border-slate-200/70 px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm shadow-slate-200/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 hover:shadow-md dark:border-white/10 dark:text-slate-100 dark:hover:border-white/30 dark:hover:text-white dark:shadow-black/30';

const NotFound = () => {
  const { t } = useTranslation('notFound');
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/');
  };

  return (
    <motion.section
      className="relative mx-auto flex w-full max-w-3xl flex-col items-center overflow-hidden rounded-[32px] border border-white/50 bg-white/80 px-6 py-12 text-center shadow-2xl shadow-cyan-500/10 backdrop-blur dark:border-white/10 dark:bg-neutral-900/70 dark:shadow-black/40 sm:px-10 sm:py-16"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.12),transparent_60%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.15),transparent_55%)] opacity-80 blur-3xl dark:bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),transparent_50%),radial-gradient(circle_at_bottom,_rgba(15,118,110,0.2),transparent_60%)]" />
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-500 dark:text-teal-300">
        {t('eyebrow')}
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">{t('title')}</h1>
      <p className="mt-4 max-w-xl text-base text-slate-500 dark:text-slate-400">{t('description')}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <NavLink to="/" className={primaryButton}>
          {t('cta')}
        </NavLink>
        <button type="button" onClick={handleBack} className={ghostButton}>
          {t('secondary')}
        </button>
      </div>
    </motion.section>
  );
};

export default NotFound;
