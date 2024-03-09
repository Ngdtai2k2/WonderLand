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
