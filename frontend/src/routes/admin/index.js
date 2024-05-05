import Categories from '../../admin/pages/Categories';
import Dashboard from '../../admin/pages/Dashboard';
import NotFound from '../../components/NotFound';

export const adminRoutes = [
  { path: '/admin', element: <Dashboard /> },
  { path: '/admin/categories', element: <Categories /> },
  { path: '*', element: <NotFound /> },
];
