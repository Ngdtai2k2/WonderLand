import { CssBaseline } from '@mui/material';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import { store, persistor } from './redux/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import themes from './themes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <CssVarsProvider theme={themes}>
        <CssBaseline />
        <App />
        <ToastContainer />
      </CssVarsProvider>
    </PersistGate>
  </Provider>,
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
