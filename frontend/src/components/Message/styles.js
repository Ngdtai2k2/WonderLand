import { styled } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';

export const PaperMessageSender = styled(Paper)(() => ({
  width: 'fit-content',
  maxWidth: '70%',
  padding: 10,
  backgroundColor: '#138aff',
  color: '#ffffff',
}));

export const PaperMessageReceiver = styled(Paper)(() => ({
  width: 'fit-content',
  maxWidth: '70%',
  padding: 10,
  backgroundColor: '#4e4e4e',
  color: '#ffffff',
}));

export const ImageMessage = styled(Avatar)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    width: 180,
  },
  [theme.breakpoints.up('sm')]: {
    width: 300,
  },
  height: 'auto',
  border: '1px solid',
  borderRadius: '5px',
}));

export const VideoMessage = styled('video')(({ theme }) => ({
  height: 'auto',
  border: '1px solid',
  borderRadius: '5px',
  [theme.breakpoints.up('xs')]: {
    width: 200,
  },
  [theme.breakpoints.up('sm')]: {
    width: 300,
  },
}));
