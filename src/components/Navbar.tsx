import type { MouseEvent } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';

const primaryLinks = [
  { label: 'Dashboard', to: '/' },
  { label: 'Exercise 1', to: '/exercise1' },
  { label: 'Exercise 2', to: '/exercise2' },
];

const secondaryLinks = [
  { label: 'About', href: '#about' },
  { label: 'GitHub', href: 'https://github.com/amanssur-tech/d3-visualizations', external: true },
];

const anchorClasses =
  'inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-300 hover:bg-white/40 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white';

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    'inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300',
    isActive
      ? 'bg-white/70 text-slate-900 shadow dark:bg-neutral-900/70 dark:text-white'
      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5',
  ].join(' ');

interface GhostButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

const GhostButton: React.FC<GhostButtonProps> = ({ children, ...props }) => (
  <a
    {...props}
    className="inline-flex items-center rounded-xl border border-white/60 bg-white/60 px-3 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-white"
  >
    {children}
  </a>
);

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
    <path d="M12 5.25a.75.75 0 0 0 .75-.75V2.5a.75.75 0 0 0-1.5 0V4.5a.75.75 0 0 0 .75.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Zm-1.25 0a.75.75 0 0 0-.75-.75H3a.75.75 0 0 0 0 1.5H5.5a.75.75 0 0 0 .75-.75ZM12 18.75a.75.75 0 0 0-.75.75V21.5a.75.75 0 0 0 1.5 0V19.5a.75.75 0 0 0-.75-.75ZM20.25 11.25H22a.75.75 0 0 1 0 1.5H20.25a.75.75 0 0 1 0-1.5ZM6.022 6.732a.75.75 0 1 0 1.06-1.06L5.8 4.39a.75.75 0 0 0-1.061 1.06l1.283 1.283Zm11.916 10.607a.75.75 0 1 0-1.061 1.06l1.282 1.283a.75.75 0 0 0 1.061-1.06l-1.282-1.283Zm-11.916 1.06a.75.75 0 0 0-1.061 1.06l1.283 1.283a.75.75 0 0 0 1.06-1.061L6.022 18.4Zm11.916-12.667a.75.75 0 1 0-1.061-1.06l-1.282 1.283a.75.75 0 0 0 1.061 1.06l1.282-1.283Z" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
    <path d="M21.25 15.164a.75.75 0 0 0-.858-.256 7.25 7.25 0 0 1-9.3-9.3.75.75 0 0 0-1.114-.836A8.75 8.75 0 1 0 21.5 16a.75.75 0 0 0-.25-.836Z" />
  </svg>
);

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
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
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400/90 via-emerald-500/80 to-cyan-600/80 text-white shadow-lg shadow-cyan-500/40">
            <span className="text-sm font-semibold tracking-tight">D3</span>
          </div>
          <div className="leading-tight">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
              Amanullah
            </p>
            <NavLink to="/" className="text-lg font-semibold text-slate-900 dark:text-white">
              D3 Visualizations
            </NavLink>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {primaryLinks.map((item) => (
            <NavLink key={item.label} to={item.to} className={navLinkClasses}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {secondaryLinks.map((link) => {
            if (link.href?.startsWith('#') && !link.external) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={anchorClasses}
                  onClick={(event) => handleAnchorNav(event, link.href)}
                >
                  {link.label}
                </a>
              );
            }
            return (
              <GhostButton
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
              >
                {link.label}
              </GhostButton>
            );
          })}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;
