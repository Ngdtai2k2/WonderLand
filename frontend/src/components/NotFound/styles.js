import { styled } from '@mui/material/styles';

export const ImageStyle = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    width: '90%',
  },
  [theme.breakpoints.up('sm')]: {
    width: '70%',
  },
  [theme.breakpoints.up('md')]: {
    width: '40%',
  },
  height: '100%',
}));
