import { styled } from '@mui/material/styles';
import { Tab, Typography, Box } from '@mui/material';

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

export const TypographyButtonTab = styled(Typography)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

export const ButtonTab = styled(Tab)(() => ({
  display: 'flex',
  alignItems: 'flex-start',
}));

export const BoxModal = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  boxShadow: 24,
  padding: 10,
  borderRadius: 5,
});
