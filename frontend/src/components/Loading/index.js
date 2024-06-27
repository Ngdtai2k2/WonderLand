import * as React from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingCircularIndeterminate({ size }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <CircularProgress
        size={size ? size : 40}
        role="progressbar"
        aria-label="loading progress"
      />
    </Box>
  );
}
