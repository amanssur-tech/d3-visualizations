import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import Dashboard from './components/Dashboard.jsx';
import BarChart from './components/charts/BarChart.jsx';
import LineChart from './components/charts/LineChart.jsx';

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
    ],
  },
]);
