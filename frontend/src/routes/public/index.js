import NotFound from '../../components/NotFound';
import AskPage from '../../pages/askPage';
import CreatePost from '../../pages/createPost';
import FreshPage from '../../pages/freshPage';
import HomePage from '../../pages/homePage';
import PostDetail from '../../pages/postDetail';
import Profile from '../../pages/profile';
import Settings from '../../pages/settings';
import TrendingPage from '../../pages/trendingPage';

export const publicRoutes = [
  { path: '', element: <HomePage /> },
  { path: '/profile/u/:id', element: <Profile /> },
  { path: '/settings', element: <Settings />, auth: true },
  { path: '/create/post', element: <CreatePost />, auth: true },
  { path: '/top', element: <TrendingPage /> },
  { path: '/trend', element: <TrendingPage /> },
  { path: '/fresh', element: <FreshPage /> },
  { path: '/ask', element: <AskPage /> },
  { path: '/post/:id', element: <PostDetail /> },
  { path: '*', element: <NotFound /> },
];
