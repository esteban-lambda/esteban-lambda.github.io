import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4169FF',
      light: '#6B8AFF',
      dark: '#2948CC',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#1E40AF',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#1E40AF',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A202C',
      secondary: '#4A5568',
      disabled: '#A0AEC0',
    },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: '"Poppins", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.6,
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.75,
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      fontSize: '0.9375rem',
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.04)',
    '0px 2px 4px rgba(0, 0, 0, 0.06)',
    '0px 4px 8px rgba(0, 0, 0, 0.08)',
    '0px 6px 12px rgba(0, 0, 0, 0.1)',
    '0px 8px 16px rgba(0, 0, 0, 0.12)',
    '0px 12px 24px rgba(0, 0, 0, 0.14)',
    '0px 16px 32px rgba(0, 0, 0, 0.16)',
    '0px 20px 40px rgba(0, 0, 0, 0.18)',
    '0px 24px 48px rgba(0, 0, 0, 0.20)',
    '0px 28px 56px rgba(0, 0, 0, 0.22)',
    '0px 32px 64px rgba(0, 0, 0, 0.24)',
    '0px 36px 72px rgba(0, 0, 0, 0.26)',
    '0px 40px 80px rgba(0, 0, 0, 0.28)',
    '0px 44px 88px rgba(0, 0, 0, 0.30)',
    '0px 48px 96px rgba(0, 0, 0, 0.32)',
    '0px 52px 104px rgba(0, 0, 0, 0.34)',
    '0px 56px 112px rgba(0, 0, 0, 0.36)',
    '0px 60px 120px rgba(0, 0, 0, 0.38)',
    '0px 64px 128px rgba(0, 0, 0, 0.40)',
    '0px 68px 136px rgba(0, 0, 0, 0.42)',
    '0px 72px 144px rgba(0, 0, 0, 0.44)',
    '0px 76px 152px rgba(0, 0, 0, 0.46)',
    '0px 80px 160px rgba(0, 0, 0, 0.48)',
    '0px 84px 168px rgba(0, 0, 0, 0.50)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          boxShadow: 'none',
          fontWeight: 600,
          fontSize: '15px',
          textTransform: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(65, 105, 255, 0.25)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(65, 105, 255, 0.3)',
          },
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '16px',
          borderRadius: 8,
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '14px',
          borderRadius: 6,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#ffffff',
            transition: 'all 0.2s',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E2E8F0',
            },
            '&:hover': {
              backgroundColor: '#F7FAFC',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#CBD5E0',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
                borderColor: '#4169FF',
              },
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
            color: '#4A5568',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E2E8F0',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E2E8F0',
        },
        elevation2: {
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          fontSize: '12px',
          height: 28,
        },
        filled: {
          border: 'none',
        },
        filledSuccess: {
          backgroundColor: '#D1FAE5',
          color: '#065F46',
        },
        filledWarning: {
          backgroundColor: '#FEF3C7',
          color: '#92400E',
        },
        filledError: {
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
        },
        filledInfo: {
          backgroundColor: '#DBEAFE',
          color: '#1E40AF',
        },
        filledDefault: {
          backgroundColor: '#F3F4F6',
          color: '#374151',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
          backgroundColor: '#FFFFFF',
          color: '#1A202C',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: 240,
          borderRight: '1px solid #E2E8F0',
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: '#F7FAFC',
          },
          '&.Mui-selected': {
            backgroundColor: '#EBF4FF',
            color: '#4169FF',
            '&:hover': {
              backgroundColor: '#DBEAFE',
            },
            '& .MuiListItemIcon-root': {
              color: '#4169FF',
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F9FAFB',
          '& .MuiTableCell-root': {
            color: '#6B7280',
            fontWeight: 600,
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: '1px solid #E2E8F0',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F9FAFB',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #E2E8F0',
          padding: '16px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#E2E8F0',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          padding: '8px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
        },
      },
    },
  },
});

export default theme;
