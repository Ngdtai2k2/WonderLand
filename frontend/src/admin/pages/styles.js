import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const BoxModal = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  boxShadow: 24,
  padding: 10,
  borderRadius: 5,
});
