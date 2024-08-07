import { Flip, toast } from 'react-toastify';
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

export const ImagesNoData = process.env.REACT_APP_IMAGES_NO_DATA;

export const imageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

export const videoTypes = ['video/mp4', 'video/mkv'];

export const locales = [
  {
    code: 'en',
    name: 'English',
  },
  {
    code: 'vi',
    name: 'Vietnamese',
  },
];

export const COLORS = {
  error: '#ff1744',
  success: '#00e676',
  warning: '#ff9800',
};

export const toastMapForZaloTransaction = {
  1: toast.success,
  2: toast.error,
  default: toast.warning,
};
