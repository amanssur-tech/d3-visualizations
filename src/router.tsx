import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Dashboard from './components/Dashboard';
import BarChart from './components/charts/BarChart';
import LineChart from './components/charts/LineChart';
import NotFound from './components/NotFound';

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
        path: 'exercise1',
        element: <BarChart onExportReady={() => {}} />,
      },
      {
        path: 'exercise2',
        element: <LineChart onExportReady={() => {}} />,
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
