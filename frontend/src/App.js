import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

import NavigationBar from './components/NavigationBar';

import { publicRoutes } from './routes/public';
import { adminRoutes } from './routes/admin';

import ModalAuth from './pages/modalAuth';
import NotFound from './components/NotFound';
import { useToastTheme } from './constants/constant';
import { initializeSocket } from './initializeSocket';
import { Link } from '@mui/material';

function App() {
  // eslint-disable-next-line no-unused-vars
  const [openModal, setOpenModal] = useState(false);

  const toastTheme = useToastTheme();

  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;
  const decodedToken = accessToken ? jwtDecode(accessToken) : null;
  const isAdmin = decodedToken ? decodedToken.isAdmin || false : false;

  useEffect(() => {
    const socket = initializeSocket(user?._id);

    if (socket) {
      socket.on('msg-action-reaction', (msg, notification) => {
        toast.info(
          <Link
            underline="none"
            href={`/post/${notification.link}`}
            style={{ cursor: 'pointer' }}
          >
            {msg}
          </Link>,
          toastTheme,
        );
      });

      return () => {
        socket.off('msg-action-reaction');
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router>
      <NavigationBar isAdmin={isAdmin} />
      <Routes>
        {adminRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={isAdmin ? element : <NotFound />}
          />
        ))}
        {publicRoutes.map(({ path, element, auth }) => (
          <Route
            key={path}
            path={path}
            element={
              auth && !user ? (
                <ModalAuth
                  openModal={true}
                  handleCloseModal={() => setOpenModal(false)}
                />
              ) : (
                element
              )
            }
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
