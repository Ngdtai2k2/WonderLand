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

export const createElementStyleForZoom = (theme) => {
  const style = document.createElement('style');
  style.textContent = `
  [data-rmiz-modal-overlay="visible"] {
    background-color: ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
  }
`;
  document.head.appendChild(style);
};

export const BaseApi = process.env.REACT_APP_BASE_URL;
