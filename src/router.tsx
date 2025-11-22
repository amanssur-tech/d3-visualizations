import { createBrowserRouter } from 'react-router-dom';

import App from './App';
import CaseStudy1BarChart from './components/case-studies/CaseStudy1BarChart';
import CaseStudy2LineChart from './components/case-studies/CaseStudy2LineChart';
import CaseStudy3RandomizedBars from './components/case-studies/CaseStudy3RandomizedBars';
import CaseStudy4TimeOfDay from './components/case-studies/CaseStudy4TimeOfDay';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';
import CaseStudiesIndex from './pages/CaseStudiesIndex';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'case-studies',
        element: <CaseStudiesIndex />,
      },
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
