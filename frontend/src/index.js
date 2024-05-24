import React from 'react';
import ReactDOM from 'react-dom/client';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { CssBaseline } from '@mui/material';

import { store, persistor } from './redux/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import themes from './themes';

import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-medium-image-zoom/dist/styles.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log(
  "%cWARNING! %cDon't take anyone's word for running the script here...",
  'color: red; font-size: 60px',
  'color: yellow; font-size: 30px',
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CssVarsProvider theme={themes}>
          <CssBaseline />
          <App />
          <ToastContainer />
        </CssVarsProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);

reportWebVitals();
