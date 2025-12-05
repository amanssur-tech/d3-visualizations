/**
 * router.tsx declares every route in the SPA, including named paths for each case study.
 *
 * Note: Direct deep links to these routes (for example `/case-studies/...`) depend on the
 * hosting configuration rewriting all non-asset paths to `/` so that the SPA can handle
 * routing client-side (see vercel.json for the rewrite rule).
 */
import { createBrowserRouter } from 'react-router-dom';

import App from './App';
import CaseStudy1BarChart from './pages/case-studies/CaseStudy1BarChart';
import CaseStudy2LineChart from './pages/case-studies/CaseStudy2LineChart';
import CaseStudy3RandomizedBars from './pages/case-studies/CaseStudy3RandomizedBars';
import CaseStudy4TimeOfDay from './pages/case-studies/CaseStudy4TimeOfDay';
import CaseStudy5DualView from './pages/case-studies/CaseStudy5DualView';
import CaseStudy6ParallelCoordinates from './pages/case-studies/CaseStudy6ParallelCoordinates';
import CaseStudiesIndex from './pages/CaseStudiesIndex';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

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
