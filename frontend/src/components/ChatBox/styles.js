import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

export const BoxMessage = styled(Box)(() => ({
  display: 'flex',
  marginBottom: 10,
}));

export const PaperMessage = styled(Paper)(() => ({
  width: 'fit-content',
  maxWidth: '70%',
  padding: 10,
}));
