import { createTheme } from '@mui/material/styles';

// Premium Healthcare Design System Colors - Modern Palette
export const healthcareColors = {
  primary: '#0d47a1', // Deep Blue
  secondary: '#00897b', // Medical Teal
  purple: '#6200EA', // Modern Purple
  pink: '#E91E63', // Accent Pink
  accent: '#d32f2f', // Alert Red
  background: '#fafafa', // Hospital White
  backgroundDark: '#f5f7fa',
  
  // Modern Gradients
  gradientPrimary: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
  gradientSecondary: 'linear-gradient(135deg, #00897b 0%, #26a69a 100%)',
  gradientPurple: 'linear-gradient(135deg, #6200EA 0%, #7c4dff 100%)',
  gradientPink: 'linear-gradient(135deg, #E91E63 0%, #ec407a 100%)',
  gradientHero: 'linear-gradient(135deg, #0d47a1 0%, #00897b 50%, #6200EA 100%)',
  gradientCard: 'linear-gradient(135deg, rgba(13, 71, 161, 0.05) 0%, rgba(0, 137, 123, 0.05) 100%)',
  
  light: '#e3f2fd',
  dark: '#1565c0',
  
  // Modern shadow colors
  shadowPrimary: 'rgba(13, 71, 161, 0.2)',
  shadowSecondary: 'rgba(0, 137, 123, 0.2)',
  shadowPurple: 'rgba(98, 0, 234, 0.2)',
  shadowPink: 'rgba(233, 30, 99, 0.2)',
};

// Healthcare specialty colors - Enhanced with gradients
export const specialtyColors = {
  'Health Informatics': '#0d47a1',
  'Medical Devices': '#00897b',
  'Telemedicine': '#6200EA',
  'Clinical Data': '#0277bd',
  'Healthcare Cybersecurity': '#E91E63',
  'General': '#0d47a1',
};

export const specialtyGradients = {
  'Health Informatics': 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
  'Medical Devices': 'linear-gradient(135deg, #00897b 0%, #26a69a 100%)',
  'Telemedicine': 'linear-gradient(135deg, #6200EA 0%, #7c4dff 100%)',
  'Clinical Data': 'linear-gradient(135deg, #0277bd 0%, #039be5 100%)',
  'Healthcare Cybersecurity': 'linear-gradient(135deg, #E91E63 0%, #ec407a 100%)',
  'General': 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
};

// Helper function to get specialty gradient
export const getSpecialtyGradient = (specialty) => {
  return specialtyGradients[specialty] || healthcareColors.gradientPrimary;
};

// Helper function to get specialty color
export const getSpecialtyColor = (specialty) => {
  return specialtyColors[specialty] || healthcareColors.primary;
};

// Helper function to get specialty background color
export const getSpecialtyBgColor = (specialty) => {
  return healthcareColors.light;
};

// Glassmorphism styles - Enhanced
export const glassmorphism = {
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  boxShadow: '0 8px 32px 0 rgba(13, 71, 161, 0.15)',
};

// Modern shadow system
export const shadows = {
  sm: '0 2px 8px rgba(13, 71, 161, 0.08)',
  md: '0 4px 16px rgba(13, 71, 161, 0.12)',
  lg: '0 8px 24px rgba(13, 71, 161, 0.16)',
  xl: '0 12px 32px rgba(13, 71, 161, 0.2)',
  colored: {
    primary: '0 8px 24px rgba(13, 71, 161, 0.3)',
    secondary: '0 8px 24px rgba(0, 137, 123, 0.3)',
    purple: '0 8px 24px rgba(98, 0, 234, 0.3)',
    pink: '0 8px 24px rgba(233, 30, 99, 0.3)',
  },
};

// Create premium theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: healthcareColors.primary,
      light: '#1976d2',
      dark: '#0d47a1',
      contrastText: '#fff',
    },
    secondary: {
      main: healthcareColors.secondary,
      light: '#4db6ac',
      dark: '#00695c',
      contrastText: '#fff',
    },
    error: {
      main: healthcareColors.accent,
      light: '#ef5350',
      dark: '#c62828',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    background: {
      default: healthcareColors.background,
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    code: {
      fontFamily: 'Roboto Mono, monospace',
      fontSize: '0.875rem',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          padding: '12px 32px',
          fontWeight: 600,
          fontSize: '0.9375rem',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(13, 71, 161, 0.25)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          background: healthcareColors.gradientPrimary,
          '&:hover': {
            background: healthcareColors.gradientPrimary,
            boxShadow: '0 8px 20px rgba(13, 71, 161, 0.35)',
          },
        },
        containedSecondary: {
          background: healthcareColors.gradientSecondary,
          '&:hover': {
            background: healthcareColors.gradientSecondary,
            boxShadow: '0 8px 20px rgba(0, 137, 123, 0.35)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(13, 71, 161, 0.1)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid rgba(13, 71, 161, 0.08)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 32px rgba(13, 71, 161, 0.18)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 2px 12px rgba(13, 71, 161, 0.08)',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(13, 71, 161, 0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(13, 71, 161, 0.1)',
        },
        elevation3: {
          boxShadow: '0 6px 20px rgba(13, 71, 161, 0.12)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: healthcareColors.primary,
              borderWidth: '2px',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: healthcareColors.primary,
              borderWidth: '2px',
              boxShadow: '0 0 0 3px rgba(13, 71, 161, 0.1)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '3px solid white',
          boxShadow: '0 4px 12px rgba(13, 71, 161, 0.2)',
        },
      },
    },
  },
});

export default theme;
