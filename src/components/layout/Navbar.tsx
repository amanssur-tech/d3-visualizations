// src/components/layout/Navbar.tsx
/**
 * Navbar.tsx renders the sticky navigation bar with brand, primary links, case study dropdown,
 * language + theme toggles, and smooth scrolling anchor handling.
 */
import { AnimatePresence, motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useMemo, type MouseEvent as ReactMouseEvent } from 'react';
import { NavLink } from 'react-router-dom';

import { useTheme } from '../../context/ThemeContext';
import useDropdownBehavior from '../../hooks/useDropdownBehavior';
import { useTranslator } from '../../hooks/useTranslator';
import { LANG_COOKIE } from '../../i18n/i18n';
import { Button } from '../../ui/Button';
import { SunIcon, MoonIcon, ChevronIcon } from '../../ui/icons';
import { NavControlButton } from '../../ui/NavControlButton';
import { NavPill } from '../../ui/NavPill';

import CaseStudiesDropdown from './CaseStudiesDropdown';
import LanguageToggle from './LanguageToggle';

import type { SupportedLanguage } from '../../i18n/types';

// Tweak: top-level nav items for the sticky header—adjust order/labels here.
const primaryLinks = [{ labelKey: 'navbar.links.dashboard', to: '/' }] as const satisfies readonly {
  labelKey: string;
  to: string;
}[];

interface SecondaryLink {
  labelKey: string;
  href: string;
  external?: boolean;
}

// Tweak: configure secondary CTAs (anchors/external links) surfaced on the right edge.
const secondaryLinks: readonly SecondaryLink[] = [
  { labelKey: 'navbar.links.about', href: '#methodology' },
  {
    labelKey: 'navbar.links.github',
    href: 'https://github.com/amanssur-tech/d3-visualizations',
    external: true,
  },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { i18n, translate } = useTranslator(['navbar', 'common']);
  const activeLanguage: SupportedLanguage = i18n.language?.toLowerCase().startsWith('de')
    ? 'de'
    : 'en';
  const languages: SupportedLanguage[] = useMemo(() => ['en', 'de'], []);
  const dropdownId = 'case-studies-dropdown';

  const {
    isOpen: isDropdownOpen,
    toggle: toggleDropdown,
    close: closeDropdown,
    menuRef: dropdownMenuRef,
    toggleRef: dropdownToggleRef,
  } = useDropdownBehavior();

  /* ----------------------------- Smooth scroll for in-page anchors ----------------------------- */
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

  /* ----------------------------- Navigation bar layout ----------------------------- */
  return (
    <motion.header
      // Tweak: sticky header spacing + offset from top of viewport.
      className="sticky top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4 lg:px-10"
      // Tweak: entrance animation for navbar; adjust duration/delay for different feel.
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative">
          <nav
            // Tweak: glassy navbar chrome, padding, and responsive flex behavior.
            className="relative mx-auto flex flex-col gap-4 rounded-full border border-white/60 bg-white/75 px-4 py-2 text-sm shadow-[0_2px_6px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.08)] backdrop-blur-xl backdrop-saturate-150 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:border-white/10 dark:bg-neutral-900/70 dark:shadow-[0_2px_6px_rgba(0,0,0,0.35),0_4px_12px_rgba(0,0,0,0.55)]"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          >
            {/* Brand + signature */}
            <div className="flex items-center gap-3">
              {/* Tweak: brand link target/image asset per theme. */}
              <a href="https://amanssur.com" title="Go to amanssur.com">
                <img
                  src={theme === 'dark' ? '/favicons/AM-Logo-white.svg' : '/favicons/AM-Logo.svg'}
                  alt={translate('navbar.logoAlt')}
                  className="h-11 w-11 rounded-2xl"
                />
              </a>
              <div className="leading-tight">
                {/* Tweak: signature copy + typographic treatment. */}
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
                  {translate('navbar.signature')}
                </p>
                {/* Tweak: brand name text + weight. */}
                <NavLink to="/" className="text-lg font-semibold text-slate-900 dark:text-white">
                  {translate('navbar.brand')}
                </NavLink>
              </div>
            </div>

            {/* Primary navigation + dropdown toggle */}
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              {primaryLinks.map((item) => (
                <NavPill key={item.to} to={item.to}>
                  {/* Tweak: visible label for each nav pill via translation key. */}
                  {translate(item.labelKey)}
                </NavPill>
              ))}
              <NavControlButton
                ref={dropdownToggleRef}
                onClick={toggleDropdown}
                active={isDropdownOpen}
                className="gap-2"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-controls={dropdownId}
              >
                {/* Tweak: dropdown trigger text + chevron icon size. */}
                <span>{translate('navbar.dropdown.label')}</span>
                <ChevronIcon rotated={isDropdownOpen} size={14} className="" />
                <span className="sr-only">{translate('navbar.dropdown.toggle')}</span>
              </NavControlButton>
            </div>

            {/* Secondary links, language picker, theme toggle */}
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
                    {/* Tweak: CTA text per button—edit translation keys for copy. */}
                    {translate(link.labelKey)}
                  </Button>
                );
              })}
              <LanguageToggle
                activeLanguage={activeLanguage}
                languages={languages}
                translate={translate}
                onChange={(lang) => {
                  void i18n.changeLanguage(lang);
                  Cookies.set(LANG_COOKIE, lang, { expires: 365, sameSite: 'lax' });
                }}
              />
              <Button
                onClick={toggleTheme}
                variant="icon"
                aria-label={translate(
                  theme === 'dark' ? 'navbar.themeToggle.toLight' : 'navbar.themeToggle.toDark'
                )}
              >
                {/* Tweak: swap icon components to alter theme toggle visuals. */}
                {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </div>
          </nav>

          {/* Tweak: animation presence for dropdown; wrap/replace to change mount logic. */}
          <AnimatePresence>
            {isDropdownOpen && (
              <CaseStudiesDropdown
                translate={translate}
                closeDropdown={closeDropdown}
                dropdownMenuRef={dropdownMenuRef}
                dropdownId={dropdownId}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
