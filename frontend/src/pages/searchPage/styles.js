import { styled } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';

export const PaperStyle = styled(Paper)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    height: '90vh',
  },
  [theme.breakpoints.up('md')]: {
    height: '85vh',
  },
  padding: 10,
}));

export const ListButton = styled(ListItemButton)(() => ({
  borderRadius: '5px',
  height: '50px',
}));

export const ListStyle = styled(List)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    display: 'none',
  },
  [theme.breakpoints.up('sm')]: {
    display: 'block',
  },
}));

export const ListItemIconStyle = styled(ListItemIcon)(() => ({
  minWidth: '40px',
}));

export const BoxButton = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    // overflow: 'scroll',
    // maxWidth: '100%',
    gap: '10px',
  },
  [theme.breakpoints.up('sm')]: {
    display: 'none',
  },
  marginTop: '10px',
}));

export const ButtonFilter = styled(Button)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}));

export const ListContainerResult = styled(List)(() => ({
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '4px',
  padding: 5,
}));
