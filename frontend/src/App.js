import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

import { publicRoutes } from './routes/public';
import { adminRoutes } from './routes/admin';

import NavigationBar from './components/NavigationBar';
import NotFound from './components/NotFound';
import ModalAuth from './pages/modalAuth';
import {
  handleSocketEvents,
  initializeSocket,
} from './sockets/initializeSocket';

function App() {
  // eslint-disable-next-line no-unused-vars
  const [openModal, setOpenModal] = useState(false);
  const [event, setEvent] = useState();

  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;
  const decodedToken = accessToken ? jwtDecode(accessToken) : null;
  const isAdmin = decodedToken ? decodedToken.isAdmin || false : false;

  const socket = initializeSocket(user?._id);

  handleSocketEvents(socket, setEvent, isAdmin);

  return (
    <Router>
      {/* When the socket event is captured, it will change the state to call the API again */}
      <NavigationBar isAdmin={isAdmin} state={event} />
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
