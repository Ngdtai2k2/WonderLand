import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

export const BoxMessage = styled(Box)(() => ({
  display: 'flex',
  marginBottom: 10,
}));

export const ButtonUploadFile = styled(IconButton)(() => ({
  minWidth: '24px',
  height: '100%',
  marginRight: 1,
  padding: 2,
  border: 'none',
  '&:hover': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    border: 'none',
  },
}));

export const BoxImagePreview = styled(Box)(({ theme }) => ({
  position: 'absolute',
  [theme.breakpoints.up('xs')]: {
    bottom: '75px',
  },
  [theme.breakpoints.up('sm')]: {
    bottom: '100px',
  },
  [theme.breakpoints.up('md')]: {
    bottom: '70px',
  },
}));

export const ImagePreview = styled('img')(() => ({
  width: 150,
  height: 150,
  border: '1px solid',
  borderRadius: '5px',
  objectFit: 'contain',
  backgroundColor: '#fff',
}));

export const BoxMessageContainer = styled(Box)(({ theme }) => ({
  overflowX: 'hidden',
  overflowY: 'auto',
  [theme.breakpoints.up('xs')]: {
    height: '65vh',
    maxHeight: '65vh',
  },
  [theme.breakpoints.up('sm')]: {
    height: '75vh',
    maxHeight: '75vh',
  },
  [theme.breakpoints.up('md')]: {
    height: '60vh',
    maxHeight: '60vh',
  },
}));
