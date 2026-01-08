/**
 * router.tsx declares every route in the SPA, including named paths for each case study.
 *
 * Note: Direct deep links to these routes (for example `/case-studies/...`) depend on the
 * hosting configuration rewriting all non-asset paths to `/` so that the SPA can handle
 * routing client-side (see vercel.json for the rewrite rule).
 */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import App from './App';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const CaseStudiesIndex = lazy(() => import('./pages/CaseStudiesIndex'));
const CaseStudy1BarChart = lazy(() => import('./pages/case-studies/CaseStudy1BarChart'));
const CaseStudy2LineChart = lazy(() => import('./pages/case-studies/CaseStudy2LineChart'));
const CaseStudy3RandomizedBars = lazy(() => import('./pages/case-studies/CaseStudy3RandomizedBars'));
const CaseStudy4TimeOfDay = lazy(() => import('./pages/case-studies/CaseStudy4TimeOfDay'));
const CaseStudy5DualView = lazy(() => import('./pages/case-studies/CaseStudy5DualView'));
const CaseStudy6ParallelCoordinates = lazy(
  () => import('./pages/case-studies/CaseStudy6ParallelCoordinates')
);
const NotFound = lazy(() => import('./pages/NotFound'));

/* ----------------------------- App route hierarchy ----------------------------- */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Tweak: add or remove dashboard/case-study routes here to surface new pages.
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'case-studies',
        element: <CaseStudiesIndex />,
      },
      // Direct access to each case study for quick debugging
      {
        path: 'case-studies/1-bar-chart-city-comparison',
        element: <CaseStudy1BarChart />,
      },
      {
        path: 'case-studies/2-line-chart-city-trends',
        element: <CaseStudy2LineChart />,
      },
      {
        path: 'case-studies/3-randomized-bar-variation',
        element: <CaseStudy3RandomizedBars />,
      },
      {
        path: 'case-studies/4-time-of-day-sales-flawed-corrected',
        element: <CaseStudy4TimeOfDay />,
      },
      {
        path: 'case-studies/5-dual-dumbbell-bubble-city-story',
        element: <CaseStudy5DualView />,
      },
      {
        path: 'case-studies/cs5',
        element: <CaseStudy5DualView />,
      },
      {
        path: 'case-studies/6-parallel-coordinates-air-quality',
        element: <CaseStudy6ParallelCoordinates />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
