import { styled } from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';

export const GridHiddenMobile = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  [theme.breakpoints.up('xs')]: {
    display: 'none',
  },
  [theme.breakpoints.up('md')]: {
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

export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));
