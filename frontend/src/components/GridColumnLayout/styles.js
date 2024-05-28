import { styled } from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import List from '@mui/material/List';

export const GridHiddenMobile = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  [theme.breakpoints.up('xs')]: {
    display: 'none',
  },
  [theme.breakpoints.up('sm')]: {
    display: 'block',
  },
}));

export const ListContainer = styled(List)(() => ({
  width: '100%',
  height: '60vh',
  maxHeight: '60vh',
  overflowY: 'auto',
  overflowX: 'hidden',
}));
