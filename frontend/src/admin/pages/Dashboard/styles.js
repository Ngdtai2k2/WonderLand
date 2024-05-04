import Box from '@mui/material/Box';

import { styled } from '@mui/material/styles';

export const BoxItems = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-end',
  textAlign: 'end',
}));

export const BoxContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  [theme.breakpoints.up('xs')]: {
    height: '100%',
  },
  [theme.breakpoints.up('md')]: {
    height: 150,
  },
  gap: 2,
}));

export const BoxIcon = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));
