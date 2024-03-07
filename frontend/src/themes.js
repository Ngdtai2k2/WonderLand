import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

const themes = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#121212',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#f4f4f4',
        },
      },
    },
  },
  typography: {
    fontFamily: ['Raleway', 'sans-serif'].join(','),
    button: {
      textTransform: 'capitalize',
    },
  },
});

export default themes;
