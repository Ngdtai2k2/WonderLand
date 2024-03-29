import React from 'react';
import notFoundLight from '../../assets/svg/404-light.svg';
import notFoundDark from '../../assets/svg/404-dark.svg';

import { useTheme } from '@mui/material/styles';
import { DivStyle, ImageStyle } from './styles';

export default function NotFound() {
  const theme = useTheme();
  const currentMode = theme.palette.mode;

  return (
    <DivStyle>
      {currentMode === 'dark' ? (
        <ImageStyle src={notFoundLight} alt="404 not found" />
      ) : (
        <ImageStyle src={notFoundDark} alt="404 not found" />
      )}
    </DivStyle>
  );
}
