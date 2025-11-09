// src/main.tsx
import ReactDOM from 'react-dom/client';
import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { router } from './router';
import './i18n/i18n';
import './styles/global.css';

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

const container = document.getElementById('root') as HTMLElement;
if (container) {
  ReactDOM.createRoot(container).render(<Root />);
}
