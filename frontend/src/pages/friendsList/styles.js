import { styled } from '@mui/material/styles';

import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';

export const AvatarFriendList = styled(Avatar)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '50px',
    height: '50px',
  },
  [theme.breakpoints.up('md')]: {
    width: '65px',
    height: '65px',
  },
}));

export const ListContainer = styled(List)(() => ({
  width: '100%',
  maxHeight: '80vh',
  overflowY: 'auto',
  overflowX: 'hidden',
}));

export const TypographyCenter = styled(Typography)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '12px',
}));

export const ListItemButtonContainer = styled(ListItemButton)(() => ({
  gap: '8px',
  display: 'flex',
  borderRadius: '5px',
}));

export const BoxSpaceBetween = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '8px',
}));

export const BoxInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.up('xs')]: {
    gap: 0,
    flexDirection: 'column',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '4px',
    flexDirection: 'row',
  },
}));
