// src/main.tsx
import ReactDOM from 'react-dom/client';
import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import './styles/global.css';

const Root = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500 dark:bg-neutral-950 dark:text-slate-300">
          <p>Inhalte werden geladen…</p>
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
};

const container = document.getElementById('root') as HTMLElement;
if (container) {
  ReactDOM.createRoot(container).render(<Root />);
}
