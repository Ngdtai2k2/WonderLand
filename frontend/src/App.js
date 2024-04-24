import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavigationBar from './components/NavigationBar';

import { publicRoutes } from './routes/public';
import { useSelector } from 'react-redux';
import ModalAuth from './pages/modalAuth';
import { useState } from 'react';

function App() {
  // eslint-disable-next-line no-unused-vars
  const [openModal, setOpenModal] = useState(false);

  const user = useSelector((state) => state.auth.login?.currentUser);

  return (
    <Router>
      <NavigationBar />
      <Routes>
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
