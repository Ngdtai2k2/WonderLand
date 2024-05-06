import MenuItem from '@mui/material/MenuItem';

import { styled } from '@mui/material/styles';

export const MenuItemRounded = styled(MenuItem)(() => ({
  marginBottom: 4,
  marginLeft: 10,
  marginRight: 10,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
}));
