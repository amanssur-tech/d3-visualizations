/**
 * Footer.tsx renders the simple signature footer with legal + contact links.
 */
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation('footer');
  const legalHref = t('legal.href');
  const contactHref = t('cta.href');
  /* ----------------------------- Footer layout ----------------------------- */
  return (
    <motion.footer
      // Tweak: surface-level footer theming (border transparency, blur, spacing).
      className="border-t border-white/60 bg-white/60 px-4 py-6 text-center text-sm text-slate-500 backdrop-blur dark:border-white/5 dark:bg-neutral-950/70 dark:text-slate-400"
      // Tweak: adjust fade/slide timing to delay or accelerate footer entrance.
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
    >
      {/* Tweak: footer signature copy + translation key. */}
      <p>{t('signature')}</p>
      {/* Legal + contact links live here for easy edits */}
      <div className="mt-2 flex flex-col items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
        <span>{t('copyright')}</span>
        <p>
          <span className="mr-1 text-slate-500 dark:text-slate-400">{t('legal.label')}</span>
          {/* Tweak: legal link URL + underline styling for dotted line effect. */}
          <a
            href={typeof legalHref === 'string' ? legalHref : 'https://amanssur.com/legal'}
            target="_blank"
            rel="noreferrer"
            className="text-slate-600 underline decoration-dotted underline-offset-4 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            {t('legal.link')}
          </a>
        </p>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {t('cta.text')} {/* Tweak: CTA destination + hover state for contact link. */}
          <a
            href={typeof contactHref === 'string' ? contactHref : 'https://amanssur.com/#contact'}
            target="_blank"
            rel="noreferrer"
            className="text-slate-600 underline decoration-dotted underline-offset-4 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            {t('cta.link')}
          </a>
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
