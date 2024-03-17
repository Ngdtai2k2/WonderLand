import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './pages/login';
import Profile from './pages/profile';
import Register from './pages/register';
import Settings from './pages/settings';
import CreatePost from './pages/createPost';
import TopPage from './pages/topPage';
import TrendingPage from './pages/trendingPage';
import FreshPage from './pages/freshPage';
import AskPage from './pages/askPage';
import HomePage from './pages/homePage';

import NotFound from './components/NotFound';

import BlockedRoute from './routes/blockedRoute';
import LayoutWithNavbar from './routes/layoutWithNavbar';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <LayoutWithNavbar>
              <HomePage />
            </LayoutWithNavbar>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <LayoutWithNavbar>
              <Profile />
            </LayoutWithNavbar>
          }
        />
        <Route
          path="/settings"
          element={
            <BlockedRoute>
              <LayoutWithNavbar>
                <Settings />
              </LayoutWithNavbar>
            </BlockedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <BlockedRoute blocked="true">
              <Login />
            </BlockedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <BlockedRoute blocked="true">
              <Register />
            </BlockedRoute>
          }
        />
        <Route
          path="/create/post"
          element={
            <BlockedRoute>
              <LayoutWithNavbar>
                <CreatePost />
              </LayoutWithNavbar>
            </BlockedRoute>
          }
        />
        <Route
          path="/top"
          element={
            <LayoutWithNavbar>
              <TopPage />
            </LayoutWithNavbar>
          }
        />
        <Route
          path="/trend"
          element={
            <LayoutWithNavbar>
              <TrendingPage />
            </LayoutWithNavbar>
          }
        />
        <Route
          path="/fresh"
          element={
            <LayoutWithNavbar>
              <FreshPage />
            </LayoutWithNavbar>
          }
        />
        <Route
          path="/ask"
          element={
            <LayoutWithNavbar>
              <AskPage />
            </LayoutWithNavbar>
          }
        />
        <Route
          path="*"
          element={
            <LayoutWithNavbar>
              <NotFound />
            </LayoutWithNavbar>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
