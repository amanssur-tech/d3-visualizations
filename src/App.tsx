import { Outlet, useNavigation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Tooltip from './components/Tooltip';
import { ThemeProvider } from './context/ThemeContext';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';


const Layout = () => {
  const navigation = useNavigation();
  const [hydrated, setHydrated] = useState(false);
  const [routerReady, setRouterReady] = useState(false);
  const { t } = useTranslation('common');

  useEffect(() => {
    if (typeof window === 'undefined') {
      setHydrated(true);
      return undefined;
    }
    let raf = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (routerReady) return undefined;
    if (typeof window === 'undefined') {
      setRouterReady(true);
      return undefined;
    }
    if (navigation.state !== 'idle') return undefined;
    let raf = window.requestAnimationFrame(() => setRouterReady(true));
    return () => window.cancelAnimationFrame(raf);
  }, [navigation.state, routerReady]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-800 transition-colors duration-500 dark:bg-neutral-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.18),transparent_45%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.15),transparent_50%)] opacity-80 blur-3xl dark:bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.16),transparent_40%),radial-gradient(circle_at_bottom,rgba(15,118,110,0.24),transparent_55%)]" />
      <div className="relative flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 px-4 py-10 sm:px-6 lg:px-10">
          {hydrated && routerReady ? (
            <Outlet />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-white/50 bg-white/70 text-sm text-slate-500 shadow-inner backdrop-blur dark:border-white/10 dark:bg-neutral-900/40 dark:text-slate-300"
            >
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

const App = () => (
  <ThemeProvider>
    <Layout />
    <SpeedInsights />
    <Analytics />
  </ThemeProvider>
);

export default App;
