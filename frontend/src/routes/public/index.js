import NotFound from '../../components/NotFound';
import AskPage from '../../pages/askPage';
import CreatePost from '../../pages/createPost';
import FreshPage from '../../pages/freshPage';
import HomePage from '../../pages/homePage';
import Profile from '../../pages/profile';
import Settings from '../../pages/settings';
import TrendingPage from '../../pages/trendingPage';

export const publicRoutes = [
  { path: '', element: <HomePage /> },
  { path: '/profile/:id', element: <Profile /> },
  { path: '/settings', element: <Settings /> },
  { path: '/create/post', element: <CreatePost /> },
  { path: '/top', element: <TrendingPage /> },
  { path: '/trend', element: <TrendingPage /> },
  { path: '/fresh', element: <FreshPage /> },
  { path: '/ask', element: <AskPage /> },
  { path: '*', element: <NotFound /> },
];
