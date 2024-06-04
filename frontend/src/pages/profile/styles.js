import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';

import { styled } from '@mui/material/styles';

export const ButtonStyled = styled(Button)({
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  fontSize: '12px',
});

export const CoverArt = styled(Avatar)(({ theme }) => ({
  width: '100%',
  objectFit: 'cover',
  [theme.breakpoints.up('xs')]: {
    height: '20vh',
  },
  [theme.breakpoints.up('md')]: {
    height: '50vh',
  },
  borderRadius: '5px',
}));

export const AvatarProfile = styled(Avatar)(({ theme }) => ({
  border: '6px solid',
  marginLeft: 15,
  [theme.breakpoints.up('xs')]: {
    width: 110,
    height: 110,
    marginTop: -55,
  },
  [theme.breakpoints.up('md')]: {
    width: 168,
    height: 168,
    marginTop: -84,
  },
}));

export const ButtonChangeAvatar = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  [theme.breakpoints.up('xs')]: {
    right: -4,
  },
  [theme.breakpoints.up('md')]: {
    right: 16,
  },
  cursor: 'pointer',
}));

export const ButtonChangeCoverPhoto = styled(Button)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  bottom: 10,
  right: 10,
  gap: 5,
}));
