import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import noDataLight from '../../assets/svg/nodata-light.svg';
import noDataDark from '../../assets/svg/nodata-dark.svg';

import { ImageStyle } from './styles';

export default function NoData() {
  const theme = useTheme();
  const { t } = useTranslation(['message']);

  const currentMode = theme.palette.mode;

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        {currentMode === 'dark' ? (
          <ImageStyle src={noDataLight} alt="No data" />
        ) : (
          <ImageStyle src={noDataDark} alt="No data" />
        )}
      </div>
      <Typography variant="h5" textAlign="center">
        {t('message:no_data')}
      </Typography>
    </>
  );
}
