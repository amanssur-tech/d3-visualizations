// src/components/Navbar.tsx

import { AnimatePresence, motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { useTheme } from '../context/ThemeContext';
import { LANG_COOKIE } from '../i18n/i18n';
import { Button } from '../ui/Button';
import { NavControlButton } from '../ui/NavControlButton';
import { NavPill } from '../ui/NavPill';

import type { SupportedLanguage } from '../i18n/types';

const primaryLinks = [{ labelKey: 'navbar.links.dashboard', to: '/' }] as const satisfies readonly {
  labelKey: string;
  to: string;
}[];

interface SecondaryLink {
  labelKey: string;
  href: string;
  external?: boolean;
}

const secondaryLinks: readonly SecondaryLink[] = [
  { labelKey: 'navbar.links.about', href: '#methodology' },
  {
    labelKey: 'navbar.links.github',
    href: 'https://github.com/amanssur-tech/d3-visualizations',
    external: true,
  },
];

const caseStudyLinks = [
  {
    id: '1',
    labelKey: 'navbar.dropdown.items.1',
    to: '/case-studies/1-bar-chart-city-comparison',
  },
  {
    id: '2',
    labelKey: 'navbar.dropdown.items.2',
    to: '/case-studies/2-line-chart-city-trends',
  },
  {
    id: '3',
    labelKey: 'navbar.dropdown.items.3',
    to: '/case-studies/3-randomized-bar-variation',
  },
  {
    id: '4',
    labelKey: 'navbar.dropdown.items.4',
    to: '/case-studies/4-time-of-day-sales-flawed-corrected',
  },
] as const;

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownToggleRef = useRef<HTMLButtonElement | null>(null);

  const translate = (fullKey: string, options?: Record<string, unknown>): string => {
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

    const tSafe: (key: string, opts?: Record<string, unknown>) => string = t as unknown as (
      key: string,
      opts?: Record<string, unknown>
    ) => string;

    const [maybeNs, ...rest] = fullKey.split('.');
    if (maybeNs && rest.length > 0 && (knownNamespaces as readonly string[]).includes(maybeNs)) {
      const key = rest.join('.');
      return tSafe(key, { ns: maybeNs, ...(options ?? {}) });
    }

    return tSafe(fullKey, options);
  };
  const activeLanguage: SupportedLanguage = i18n.language?.toLowerCase().startsWith('de')
    ? 'de'
    : 'en';
  const languages: SupportedLanguage[] = useMemo(() => ['en', 'de'], []);
  const dropdownId = 'case-studies-dropdown';

  const closeDropdown = () => setIsDropdownOpen(false);

  useEffect(() => {
    if (!isDropdownOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (dropdownRef.current?.contains(target) || dropdownToggleRef.current?.contains(target)) {
        return;
      }
      setIsDropdownOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleAnchorNav = (event: ReactMouseEvent<HTMLAnchorElement>, href?: string) => {
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
      className="sticky top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4 lg:px-10"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative">
          <nav
            className="relative mx-auto flex flex-col gap-4 rounded-full border border-white/60 bg-white/75 px-4 py-2 text-sm shadow-[0_2px_6px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.08)] backdrop-blur-xl backdrop-saturate-150 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:border-white/10 dark:bg-neutral-900/70 dark:shadow-[0_2px_6px_rgba(0,0,0,0.35),0_4px_12px_rgba(0,0,0,0.55)]"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          >
            <div className="flex items-center gap-3">
              <a href="https://amanssur.com" title="Go to amanssur.com">
                <img
                  src={theme === 'dark' ? '/favicons/AM-Logo-white.svg' : '/favicons/AM-Logo.svg'}
                  alt={translate('navbar.logoAlt')}
                  className="h-11 w-11 rounded-2xl"
                />
              </a>
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
                <NavPill key={item.to} to={item.to}>
                  {translate(item.labelKey)}
                </NavPill>
              ))}
              <NavControlButton
                ref={dropdownToggleRef}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                active={isDropdownOpen}
                className="gap-2"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-controls={dropdownId}
              >
                <span>{translate('navbar.dropdown.label')}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
                <span className="sr-only">{translate('navbar.dropdown.toggle')}</span>
              </NavControlButton>
            </div>

            <div className="flex items-center gap-2">
              {secondaryLinks.map((link) => {
                const isAnchor = link.href?.startsWith('#') && !link.external;
                return (
                  <Button
                    key={link.href}
                    as="a"
                    href={link.href}
                    variant="pill"
                    onClick={isAnchor ? (event) => handleAnchorNav(event, link.href) : undefined}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noreferrer' : undefined}
                  >
                    {translate(link.labelKey)}
                  </Button>
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
                        void i18n.changeLanguage(lang);
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
                        {translate(
                          lang === 'en' ? 'navbar.languageToggle.en' : 'navbar.languageToggle.de'
                        )}
                      </span>
                      <span className="sr-only">
                        {translate(
                          lang === 'en' ? 'common.languages.english' : 'common.languages.german'
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
              <Button
                onClick={toggleTheme}
                variant="icon"
                aria-label={translate(
                  theme === 'dark' ? 'navbar.themeToggle.toLight' : 'navbar.themeToggle.toDark'
                )}
              >
                {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </div>
          </nav>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                id={dropdownId}
                ref={dropdownRef}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute left-1/2 top-full mt-3 pt-4 pl-3.5 w-1/4 min-w-[20rem] transform -translate-x-1/2 rounded-[28px] border border-white/60 bg-white/80 shadow-[0_12px_40px_rgba(15,23,42,0.18)] backdrop-blur-xl backdrop-saturate-150 dark:border-white/15 dark:bg-neutral-900/85 dark:shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
                style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
              >
                <p className="px-4 pb-1.5 pt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                  {translate('navbar.dropdown.eyebrow')}
                </p>
                {caseStudyLinks.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.to}
                    className="inline-flex w-full px-4 py-2 text-sm font-medium whitespace-nowrap text-slate-900 dark:text-slate-100 transition-all duration-200 hover:text-slate-950 dark:hover:text-white hover:font-semibold hover:-translate-y-[1px]"
                    onClick={closeDropdown}
                  >
                    {translate(item.labelKey)}
                  </NavLink>
                ))}
                <NavLink
                  to="/case-studies"
                  className="inline-flex w-full px-4 py-3 pb-5 text-sm font-semibold whitespace-nowrap text-slate-900 dark:text-slate-200 transition-all duration-200 hover:text-slate-950 dark:hover:text-white hover:-translate-y-[1px]"
                  onClick={closeDropdown}
                >
                  {translate('navbar.dropdown.viewAll')}
                  <span className="inline-block ml-1">↗</span>
                </NavLink>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
