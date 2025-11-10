// src/components/Navbar.tsx

import { useMemo, type MouseEvent } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import type { SupportedLanguage } from '../i18n/types';
import { LANG_COOKIE } from '../i18n/i18n';

const primaryLinks = [
  { labelKey: 'navbar.links.dashboard', to: '/' },
  { labelKey: 'navbar.links.exercise1', to: '/exercise1' },
  { labelKey: 'navbar.links.exercise2', to: '/exercise2' },
] as const satisfies ReadonlyArray<{ labelKey: string; to: string }>;

interface SecondaryLink {
  labelKey: string;
  href: string;
  external?: boolean;
}

const secondaryLinks: readonly SecondaryLink[] = [
  { labelKey: 'navbar.links.about', href: '#about' },
  {
    labelKey: 'navbar.links.github',
    href: 'https://github.com/amanssur-tech/d3-visualizations',
    external: true,
  },
];

const anchorClasses =
  'inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/60 hover:text-slate-900 hover:shadow-md dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white dark:shadow-black/30';

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    'inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300',
    isActive
      ? 'bg-white/70 text-slate-900 shadow dark:bg-neutral-900/70 dark:text-white'
      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5',
  ].join(' ');

const SunIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-inherit"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.636 5.636 4.222 4.222M19.778 19.778l-1.414-1.414M18.364 5.636l1.414-1.414M5.636 18.364 4.222 19.778" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-inherit"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation(['navbar', 'common']);
  const translate = (fullKey: string, options?: Record<string, unknown>) => {
    const knownNamespaces = [
      'common',
      'navbar',
      'footer',
      'dashboard',
      'charts',
      'export',
      'tooltips',
    ] as const;

    const [maybeNs, ...rest] = fullKey.split('.');
    if (maybeNs && rest.length > 0 && (knownNamespaces as readonly string[]).includes(maybeNs)) {
      const key = rest.join('.');
      return t(key, { ns: maybeNs, ...(options || {}) } as any);
    }

    return t(fullKey, options as any);
  };
  const activeLanguage: SupportedLanguage = i18n.language?.toLowerCase().startsWith('de') ? 'de' : 'en';
  const languages: SupportedLanguage[] = useMemo(() => ['en', 'de'], []);

  const handleAnchorNav = (event: MouseEvent<HTMLAnchorElement>, href?: string) => {
    if (!href?.startsWith('#')) return;
    if (typeof document === 'undefined') return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', href);
    }
  };

  return (
    <motion.header
      className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-neutral-950/60"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
    >
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img
            src="/favicons/AM-Logo-D3.svg"
            alt={translate('navbar.logoAlt')}
            className="h-11 w-11 rounded-2xl"
          />
          <div className="leading-tight">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
              {translate('navbar.signature')}
            </p>
            <NavLink to="/" className="text-lg font-semibold text-slate-900 dark:text-white">
              {translate('navbar.brand')}
            </NavLink>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {primaryLinks.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClasses}>
              {translate(item.labelKey)}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {secondaryLinks.map((link) => {
            const isAnchor = link.href?.startsWith('#') && !link.external;
            return (
              <a
                key={link.href}
                href={link.href}
                className={anchorClasses}
                onClick={isAnchor ? (event) => handleAnchorNav(event, link.href) : undefined}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
              >
                {translate(link.labelKey)}
              </a>
            );
          })}
          <div
            className="inline-flex items-center gap-1 rounded-full border border-slate-200/70 bg-white/70 p-1 text-xs font-semibold text-slate-600 shadow-sm shadow-slate-200/60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:shadow-black/40"
            role="group"
            aria-label={translate('navbar.languageToggle.aria')}
          >
            {languages.map((lang) => {
              const isActive = activeLanguage === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    if (isActive) return;
                    i18n.changeLanguage(lang);
                    Cookies.set(LANG_COOKIE, lang, { expires: 365, sameSite: 'lax' });
                  }}
                  className={`inline-flex items-center rounded-full px-3 py-1 transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm shadow-cyan-500/25 ring-1 ring-cyan-200/60 dark:bg-neutral-900 dark:text-white dark:shadow-cyan-500/30 dark:ring-cyan-400/40'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                  aria-pressed={isActive}
                >
                  <span aria-hidden="true">
                    {translate(lang === 'en' ? 'navbar.languageToggle.en' : 'navbar.languageToggle.de')}
                  </span>
                  <span className="sr-only">
                    {translate(lang === 'en' ? 'common.languages.english' : 'common.languages.german')}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/70 text-slate-500 shadow-sm shadow-slate-200/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 hover:shadow-md dark:border-white/15 dark:text-slate-100 dark:hover:border-white/40 dark:hover:text-white dark:shadow-black/40"
            aria-label={translate(theme === 'dark' ? 'navbar.themeToggle.toLight' : 'navbar.themeToggle.toDark')}
          >
            {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;
