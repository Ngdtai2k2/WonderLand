import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import BlockedRoute from './routes/blockedRoute';
import Home from './pages/home';
import Login from './pages/login';
import NavigationBar from './components/NavigationBar';
import Profile from './pages/profile';
import Register from './pages/register';
import Settings from './pages/settings';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          exact
          element={
            <>
              <NavigationBar />
              <Home />
            </>
          }
        />
        <Route
          path="/profile/:id"
          exact
          element={
            <>
              <NavigationBar />
              <Profile />
            </>
          }
        />
        <Route
          path="/settings"
          exact
          element={
            <BlockedRoute>
              <NavigationBar />
              <Settings />
            </BlockedRoute>
          }
        />
        <Route
          path="/login"
          exact
          element={
            <BlockedRoute blocked="true">
              <Login />
            </BlockedRoute>
          }
        />
        <Route
          path="/register"
          exact
          element={
            <BlockedRoute blocked="true">
              <Register />
            </BlockedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
