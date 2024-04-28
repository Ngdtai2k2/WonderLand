import { Flip } from 'react-toastify';
import { useTheme } from '@emotion/react';

export const useToastTheme = () => {
  const theme = useTheme();
  return {
    autoClose: 3000,
    theme: theme.palette.mode,
    transition: Flip,
    closeOnClick: true,
    pauseOnHover: true,
  };
};

export const IntersectionObserverOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.85,
};

export const BaseApi = process.env.REACT_APP_BASE_URL;
