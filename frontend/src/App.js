import { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';

import NavigationBar from './components/NavigationBar';

import { publicRoutes } from './routes/public';
import ModalAuth from './pages/modalAuth';
import { adminRoutes } from './routes/admin';
import NotFound from './components/NotFound';

function App() {
  // eslint-disable-next-line no-unused-vars
  const [openModal, setOpenModal] = useState(false);

  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;
  const decodedToken = accessToken ? jwtDecode(accessToken) : null;
  const isAdmin = decodedToken ? decodedToken.isAdmin || false : false;

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
