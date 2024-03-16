import { Box, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CardActionsStyled = styled(CardActions)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const BoxStyled = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));
