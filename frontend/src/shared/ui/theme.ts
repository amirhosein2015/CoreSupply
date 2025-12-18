import { createTheme } from '@mui/material/styles';

export const industrialTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00e5ff' }, 
    secondary: { main: '#ff9100' }, 
    warning: { main: '#ff9100' }, // نارنجی ایمنی برای Pending
    background: {
      default: '#050c1d', 
      paper: '#0a192f',   
    },
    text: { primary: '#e6f1ff', secondary: '#8892b0' },
    divider: 'rgba(0, 229, 255, 0.15)',
  },
  shape: { borderRadius: 0 }, 
  typography: {
    fontFamily: '"JetBrains Mono", "Roboto Mono", monospace',
    h4: { fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(0, 229, 255, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          border: '1px solid',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          fontWeight: 900,
        },
      },
    },
  },
});
