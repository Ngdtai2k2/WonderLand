import React from 'react';

import Box from '@mui/material/Box';

function CustomBox(props) {
  return (
    <Box sx={{ flexGrow: 1, marginTop: 10, marginX: 3 }} {...props}>
      {props.children}
    </Box>
  );
}

export default CustomBox;
