import { styled } from '@mui/material/styles';

export const ImageStyle = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    width: '90%',
  },
  [theme.breakpoints.up('md')]: {
    width: '60%',
  },
  height: '100%',
  marginTop: 3,
}));
