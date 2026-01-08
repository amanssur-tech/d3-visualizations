/**
 * App.tsx wires together the site-wide layout shell with Navbar, Outlet, Footer,
 * hydration-friendly fallback handling, analytics widgets, and the ThemeProvider.
 */
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { motion } from 'framer-motion';
import { useEffect, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigation } from 'react-router-dom';

import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import Tooltip from './components/Tooltip';
import { ThemeProvider } from './context/ThemeContext';

const Layout = () => {
  const navigation = useNavigation();
  const [hydrationState, setHydrationState] = useState({
    isHydrated: false,
    isRouterReady: false,
  });
  const { isHydrated, isRouterReady } = hydrationState;
  const { t } = useTranslation('common');

  /* ----------------------------- Hydration guard ----------------------------- */
  useEffect(() => {
    if (globalThis.window === undefined) {
      setHydrationState((prev) => (prev.isHydrated ? prev : { ...prev, isHydrated: true }));
      return undefined;
    }
    const raf = globalThis.window.requestAnimationFrame(() => {
      setHydrationState((prev) => (prev.isHydrated ? prev : { ...prev, isHydrated: true }));
    });
    return () => globalThis.window.cancelAnimationFrame(raf);
  }, []);

  /* ----------------------------- Wait for router to settle ----------------------------- */
  useEffect(() => {
    if (isRouterReady) return undefined;
    if (globalThis.window === undefined) {
      setHydrationState((prev) => (prev.isRouterReady ? prev : { ...prev, isRouterReady: true }));
      return undefined;
    }
    if (navigation.state !== 'idle') return undefined;
    const raf = globalThis.window.requestAnimationFrame(() => {
      setHydrationState((prev) => (prev.isRouterReady ? prev : { ...prev, isRouterReady: true }));
    });
    return () => globalThis.window.cancelAnimationFrame(raf);
  }, [navigation.state, isRouterReady]);

  /* ----------------------------- Layout markup ----------------------------- */
  return (
    // Tweak: overall app chrome colors + transition speeds for light/dark background.
    <div className="relative min-h-screen bg-slate-50 text-slate-800 transition-colors duration-500 dark:bg-neutral-950 dark:text-slate-100">
      {/* Tweak: change flex direction/padding here to reshape the page skeleton. */}
      <div className="relative flex min-h-screen flex-col">
        <Navbar />
        {/* Tweak: adjust spacing tokens here to change page padding on each breakpoint. */}
        <main className="flex-1 px-4 py-10 sm:px-6 lg:px-10">
          {isHydrated && isRouterReady ? (
            <Outlet />
          ) : (
            /* Loading shell so devs know where to edit fallback copy */
            <motion.div
              // Tweak: adjust opacity animation curve while router hydrates.
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              // Tweak: loading card look/feel (rounded corners, blur, border balance).
              className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-white/50 bg-white/70 text-sm text-slate-500 shadow-inner backdrop-blur dark:border-white/10 dark:bg-neutral-900/40 dark:text-slate-300"
            >
              {/* Tweak: fallback copy surfaced before routes mount. */}
              {t('initializingDashboard')}
            </motion.div>
          )}
        </main>
        <Footer />
      </div>
      <Tooltip />
    </div>
  );
};

/* ----------------------------- Theme provider root ----------------------------- */
const App = (): ReactElement => (
  <ThemeProvider>
    <Layout />
    <SpeedInsights />
    <Analytics />
  </ThemeProvider>
);

export default App;
