import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BarChart from './charts/BarChart.jsx';
import LineChart from './charts/LineChart.jsx';

const MotionLink = motion(Link);

const statCards = [
  { label: 'Cities tracked', value: '8', detail: 'Major German metros' },
  { label: 'Years of history', value: '6', detail: '2020 → 2025' },
  { label: 'Data refresh', value: 'Weekly', detail: 'Automated pipeline' },
];

const actionCards = [
  {
    id: 1,
    title: 'Explore Bar Insights',
    description: 'Vergleiche alle Städte und entdecke die stärksten Kebap-Hotspots.',
    to: '/exercise1',
  },
  {
    id: 2,
    title: 'Explore Line Trends',
    description: 'Verfolge die Entwicklung in Köln und Berlin über die letzten Jahre.',
    to: '/exercise2',
  },
  {
    id: 3,
    title: 'Coming Soon',
    description: 'Neue Visualisierungen in Arbeit – bleib gespannt auf frische Perspektiven.',
    to: '/',
    disabled: true,
  },
];

const Dashboard = () => {
  const [barHandlers, setBarHandlers] = useState<{ exportSvg: () => void; exportPng: () => void } | null>(null);
  const [lineHandlers, setLineHandlers] = useState<{ exportSvg: () => void; exportPng: () => void } | null>(null);
  const [downloading, setDownloading] = useState(false);
  const handleBarReady = useCallback((handlers: { exportSvg: () => void; exportPng: () => void }) => setBarHandlers(handlers), []);
  const handleLineReady = useCallback((handlers: { exportSvg: () => void; exportPng: () => void }) => setLineHandlers(handlers), []);

  const exportsReady = useMemo(() => barHandlers && lineHandlers, [barHandlers, lineHandlers]);
  const chartCards = [
    {
      id: 'bar',
      title: 'Exercise 1 · City Comparison',
      subtitle: 'Rounded bars, gradients, and export-ready insights.',
      component: (
        <BarChart
          showHeader={false}
          framed={false}
          onExportReady={handleBarReady}
        />
      ),
      link: '/exercise1',
    },
    {
      id: 'line',
      title: 'Exercise 2 · Growth over Time',
      subtitle: 'Smooth lines comparing Köln und Berlin 2020–2025.',
      component: (
        <LineChart
          showHeader={false}
          framed={false}
          onExportReady={handleLineReady}
        />
      ),
      link: '/exercise2',
    },
  ];

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleDownloadAll = async () => {
    if (!exportsReady || downloading) return;
    setDownloading(true);
    const queue = [barHandlers, lineHandlers];
    for (const handlers of queue) {
      if (!handlers) continue;
      await Promise.resolve(handlers.exportSvg());
      await delay(200);
      await Promise.resolve(handlers.exportPng());
      await delay(200);
    }
    setDownloading(false);
  };

  return (
    <motion.div
      className="mx-auto flex max-w-6xl flex-col gap-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.section
        className="rounded-3xl border border-white/60 bg-white/70 px-6 py-8 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-white/10 dark:bg-neutral-950/60 sm:px-8 lg:px-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          Kebabläden Monitor
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
          D3 Visualizations Dashboard
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
          Eine moderne Data Story über Kebabläden in Deutschland – optimiert für helle und dunkle Umgebungen,
          voll animiert mit Framer Motion und D3.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDownloadAll}
            className="rounded-2xl bg-linear-to-r from-cyan-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!exportsReady || downloading}
          >
            {downloading ? 'Bereite Downloads vor…' : 'Alles exportieren'}
          </button>
          <Link
            to="/exercise1"
            className="rounded-2xl border border-slate-200/80 bg-white/60 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-white hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          >
            Direkt zu Übung 1
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5"
            >
              <p className="text-xs uppercase tracking-[0.3em]">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.detail}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <section className="grid gap-6 lg:grid-cols-2">
        {chartCards.map((card, index) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-2xl bg-white/70 p-6 shadow-md shadow-slate-900/5 backdrop-blur dark:bg-neutral-900/60"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Chart</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{card.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-300">{card.subtitle}</p>
              </div>
              <Link
                to={card.link}
                className="rounded-xl border border-white/70 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-white hover:bg-white/80 hover:text-slate-900 dark:border-white/10 dark:text-slate-300"
              >
                Open
              </Link>
            </div>
            <div className="mt-6">
              {card.component}
            </div>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {actionCards.map((card, index) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: card.disabled ? 1 : 1.02 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
            className={`rounded-2xl border border-white/60 p-5 text-sm shadow-sm backdrop-blur dark:border-white/10 ${
              card.disabled
                ? 'bg-white/30 text-slate-400 dark:bg-white/5'
                : 'bg-white/70 text-slate-600 dark:bg-neutral-900/70'
            }`}
          >
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Route</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{card.title}</h3>
            <p className="mt-2 text-sm">{card.description}</p>
            {!card.disabled && (
              <MotionLink
                to={card.to}
                className="mt-4 inline-flex items-center text-sm font-semibold text-cyan-600 transition hover:text-emerald-500 dark:text-cyan-300"
                whileHover={{ x: 4 }}
              >
                Öffnen →
              </MotionLink>
            )}
          </motion.div>
        ))}
      </section>

      <motion.section
        id="about"
        className="rounded-3xl border border-white/60 bg-white/70 px-6 py-8 shadow-lg backdrop-blur dark:border-white/10 dark:bg-neutral-950/60 sm:px-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Über das Projekt</h2>
        <p className="mt-3 max-w-3xl text-base text-slate-600 dark:text-slate-300">
          Diese Oberfläche wurde komplett mit Tailwind, React und D3 überarbeitet. Alle Komponenten sind responsiv,
          unterstützen Dark Mode und bieten animierte Übergänge für ein ruhiges Dashboard-Erlebnis.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {['Framer Motion Animations', 'Glassmorphism Panels', 'Export-ready Charts'].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              {item}
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Dashboard;
