import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

export const ImageStyle = styled('img')(() => ({
  height: '100%',
  width: '50px',
  objectFit: 'contain',
  borderRadius: '5px',
  marginTop: 5,
  marginBottom: 5,
}));

export const LinkStyle = styled(Link)(() => ({
  cursor: 'pointer',
}));
