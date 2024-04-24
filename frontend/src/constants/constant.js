import { Flip } from 'react-toastify';

export const toastTheme = {
  autoClose: 3000,
  theme: 'colored',
  transition: Flip,
};

export const IntersectionObserverOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.85,
};

export const BaseApi = process.env.REACT_APP_BASE_URL;
