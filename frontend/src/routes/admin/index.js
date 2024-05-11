import Categories from '../../admin/pages/Categories';
import Dashboard from '../../admin/pages/Dashboard';
import ReportsManager from '../../admin/pages/Reports';
import Rules from '../../admin/pages/Rules';
import NotFound from '../../components/NotFound';

export const adminRoutes = [
  { path: '/admin', element: <Dashboard /> },
  { path: '/admin/categories', element: <Categories /> },
  { path: '/admin/rules', element: <Rules /> },
  { path: '/admin/reports', element: <ReportsManager /> },
  { path: '*', element: <NotFound /> },
];
