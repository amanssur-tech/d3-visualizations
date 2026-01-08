/**
 * main.tsx bootstraps the React app, loads i18n + global styles, and mounts the router.
 */
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { useTranslation } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';

import './i18n/i18n';
import './styles/global.css';
import { router } from './router';

/* ----------------------------- Suspense fallback view ----------------------------- */
const LoadingScreen = () => {
  const { t } = useTranslation('common');
  return (
    // Tweak: minimal full-screen splash styling while translations load.
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500 dark:bg-neutral-950 dark:text-slate-300">
      {/* Tweak: Suspense fallback copy key lives here. */}
      <p>{t('loadingContent')}</p>
    </div>
  );
};

/* ----------------------------- Router with Suspense ----------------------------- */
const Root = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

/* ----------------------------- App mount ----------------------------- */
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

createRoot(container).render(<Root />);
