import React, { useEffect } from 'react';

import { useTheme } from '@mui/material/styles';

import notFoundLight from '../../assets/svg/404-light.svg';
import notFoundDark from '../../assets/svg/404-dark.svg';

import { DivStyle, ImageStyle } from './styles';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found';
  });

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
