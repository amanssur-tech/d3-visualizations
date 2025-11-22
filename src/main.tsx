// src/main.tsx
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { useTranslation } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';

import './i18n/i18n';
import './styles/global.css';
import { router } from './router';

const LoadingScreen = () => {
  const { t } = useTranslation('common');
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500 dark:bg-neutral-950 dark:text-slate-300">
      <p>{t('loadingContent')}</p>
    </div>
  );
};

const Root = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(container).render(<Root />);
