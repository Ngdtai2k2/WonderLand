import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

export const LeftAlignLink = styled(Link)({
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 'auto',
  marginRight: 5,
  paddingRight: 5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  width: 'fit-content',
});

export const BoxStyle = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  boxShadow: 24,
  p: 1,
});
