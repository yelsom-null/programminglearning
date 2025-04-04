import { createTheme } from '@mui/material/styles';

// Font imports
const fontImportScript = document.createElement('link');
fontImportScript.rel = 'stylesheet';
fontImportScript.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
document.head.appendChild(fontImportScript);

// Theme optimized for learning and readability
const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.65)', // Slightly darker for better contrast
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    // Using Open Sans for better readability
    fontFamily: '"Open Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    // Font sizes adjusted for better legibility
    h1: {
      fontSize: '2.5rem', // Reduced from 6rem for more practical headings
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.005em',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.005em',
      lineHeight: 1.3,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: 0,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: 0,
      lineHeight: 1.4,
    },
    // Body text optimized for reading
    body1: {
      fontSize: '1.0625rem', // 17px - better for reading
      fontWeight: 400,
      letterSpacing: 0,
      lineHeight: 1.6, // Increased for better readability
    },
    body2: {
      fontSize: '0.9375rem', // 15px 
      fontWeight: 400,
      letterSpacing: 0,
      lineHeight: 1.6,
    },
    subtitle1: {
      fontSize: '1.0625rem',
      fontWeight: 500,
      letterSpacing: 0,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.9375rem',
      fontWeight: 500,
      letterSpacing: 0,
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 4,
  },
  spacing: 8, // Base spacing of 8px
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
          borderRadius: '4px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        // Add bottom margin to paragraphs for better visual separation
        paragraph: {
          marginBottom: '1.2em',
        },
        // Make code elements use monospace font
        root: {
          '& code': {
            fontFamily: '"JetBrains Mono", "Consolas", "Monaco", monospace',
            fontSize: '0.9em',
            padding: '0.2em 0.4em',
            borderRadius: '3px',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    // Improve code block styling
    MuiPaper: {
      styleOverrides: {
        root: {
          '& pre': {
            fontFamily: '"JetBrains Mono", "Consolas", "Monaco", monospace',
            fontSize: '0.9375rem',
            lineHeight: 1.5,
          },
        },
      },
    },
  },
});

// Add dark mode theme variant with improved contrast
export const darkTheme = createTheme({
  ...muiTheme,
  palette: {
    ...muiTheme.palette,
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.92)', // Improved contrast from 0.87
      secondary: 'rgba(255, 255, 255, 0.7)', // Improved contrast from 0.6
      disabled: 'rgba(255, 255, 255, 0.45)', // Improved contrast from 0.38
    },
  },
  components: {
    ...muiTheme.components,
    MuiTypography: {
      styleOverrides: {
        root: {
          '& code': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Better contrast in dark mode
          },
        },
      },
    },
  },
});

export default muiTheme; 