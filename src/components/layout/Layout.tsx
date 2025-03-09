import { ReactNode } from 'react';
import { AppBar, Box, Container, CssBaseline, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7B1FA2',
      light: '#9C27B0',
      dark: '#4A148C',
    },
    secondary: {
      main: '#00BFA5',
      light: '#1DE9B6',
      dark: '#00897B',
    },
    background: {
      default: '#0A1929',
      paper: '#132F4C',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #7B1FA2 30%, #4A148C 90%)',
          boxShadow: '0 3px 5px 2px rgba(123, 31, 162, .3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        contained: {
          boxShadow: '0 3px 5px 2px rgba(123, 31, 162, .3)',
        },
      },
    },
  },
});

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src="/vite.svg" alt="logo" style={{ width: 32, height: 32, marginRight: 16 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                KYC Form Builder
              </Typography>
            </Box>
            <Box sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: 16,
              padding: '4px 12px',
              display: 'flex',
              alignItems: 'center',
              marginLeft: 2
            }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                345
              </Typography>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                KYC Submissions made today
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
          {children}
        </Container>
        <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[200] }}>
          <Container maxWidth="sm">
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} KYC Form Builder. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}