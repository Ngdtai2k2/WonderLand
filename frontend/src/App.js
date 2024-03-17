import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import BlockedRoute from './routes/blockedRoute';
import NotFound from './components/NotFound';
import Home from './pages/home';
import Login from './pages/login';
import Profile from './pages/profile';
import Register from './pages/register';
import Settings from './pages/settings';
import CreatePost from './pages/createPost';
import LayoutWithNavbar from './routes/layoutWithNavbar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutWithNavbar><Home /></LayoutWithNavbar>} />
        <Route path="/profile/:id" element={<LayoutWithNavbar><Profile /></LayoutWithNavbar>} />
        <Route path="/settings" element={<BlockedRoute><LayoutWithNavbar><Settings /></LayoutWithNavbar></BlockedRoute>} />
        <Route path="/login" element={<BlockedRoute blocked="true"><Login /></BlockedRoute>} />
        <Route path="/register" element={<BlockedRoute blocked="true"><Register /></BlockedRoute>} />
        <Route path="/create/post" element={<BlockedRoute><LayoutWithNavbar><CreatePost /></LayoutWithNavbar></BlockedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
