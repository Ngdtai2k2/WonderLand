import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavigationBar from './components/NavigationBar';

import { publicRoutes } from './routes/public';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
