import { styled } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

export const BoxModal = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  boxShadow: 24,
  padding: 10,
});

export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
  cursor: 'pointer',
});

export const PaperSticky = styled(Paper)({
  position: 'sticky',
  padding: 15,
});
