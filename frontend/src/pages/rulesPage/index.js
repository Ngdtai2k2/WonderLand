import React, { useEffect } from 'react';
import { useTheme } from '@emotion/react';

import Grid from '@mui/material/Grid';

import CustomBox from '../../components/CustomBox';
import Rules from '../../components/Rules';

import Ruleslight from '../../assets/svg/rules-light.svg';
import Rulesdark from '../../assets/svg/rules-dark.svg';

import { ImageStyle } from './styles';

export default function RulesPage() {
  useEffect(() => {
    document.title = `WonderLand's rules`;
  });

  const theme = useTheme();
  const currentMode = theme.palette.mode;

  return (
    <CustomBox>
      <Grid container>
        <Grid item xs={12} sm={4}>
          {currentMode === 'dark' ? (
            <ImageStyle src={Ruleslight} alt="image rules" />
          ) : (
            <ImageStyle src={Rulesdark} alt="image rules" />
          )}
        </Grid>
        <Grid item xs={12} sm={8}>
          <Rules />
        </Grid>
      </Grid>
    </CustomBox>
  );
}
