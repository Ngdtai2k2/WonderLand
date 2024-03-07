import { Tab, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const TypographyButtonTab = styled(Typography)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

export const ButtonTab = styled(Tab)(() => ({
  display: 'flex',
  alignItems: 'flex-start',
}));

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
