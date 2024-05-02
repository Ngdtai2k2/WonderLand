import { Box, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ImageStyle = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    width: '90%',
  },
  [theme.breakpoints.up('md')]: {
    width: '60%',
  },
  height: 'auto',
  marginTop: 3,
  borderRadius: '5px',
}));

export const ImageReplyStyle = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    width: '50%',
  },
  [theme.breakpoints.up('md')]: {
    width: '30%',
  },
  height: 'auto%',
  marginTop: 3,
  borderRadius: '5px',
}));

export const BoxComment = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  paddingRight: 0,
  paddingTop: 1,
  paddingBottom: 1,
  marginTop: 1,
  gap: 5,
}));

export const BoxAlignCenter = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

export const ButtonLink = styled(Link)(() => ({
  marginBottom: 4,
  display: 'flex',
  alignItems: 'center',
  width: 'fit-content',
  cursor: 'pointer',
  fontSize: 14,
}));
