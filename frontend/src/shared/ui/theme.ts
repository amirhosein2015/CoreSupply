import { createTheme } from '@mui/material/styles';

export const industrialTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#002F5D',
      light: '#33587d',
      dark: '#001a33',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F5F7',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 4 },
});
