import { createTheme } from '@mui/material/styles';

// Premium Luxury Design System Colors - Elegant Palette
export const healthcareColors = {
  primary: '#1E3A5F', // Sophisticated Blue
  secondary: '#6366F1', // Subtle Purple
  purple: '#6366F1', // Subtle Purple
  pink: '#D4AF37', // Gold Accent
  accent: '#D4AF37', // Gold Accent
  background: '#F8F9FA', // Soft Gray
  backgroundDark: '#0F1419', // Deep Navy
  
  // Modern Gradients
  gradientPrimary: 'linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%)',
  gradientSecondary: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
  gradientPurple: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
  gradientPink: 'linear-gradient(135deg, #D4AF37 0%, #F0C850 100%)',
  gradientHero: 'linear-gradient(135deg, #0F1419 0%, #1E3A5F 50%, #2C5282 100%)',
  gradientCard: 'linear-gradient(135deg, rgba(30, 58, 95, 0.03) 0%, rgba(99, 102, 241, 0.03) 100%)',
  
  light: '#F8F9FA',
  dark: '#1F2937',
  
  // Modern shadow colors
  shadowPrimary: 'rgba(30, 58, 95, 0.15)',
  shadowSecondary: 'rgba(99, 102, 241, 0.15)',
  shadowPurple: 'rgba(99, 102, 241, 0.15)',
  shadowPink: 'rgba(212, 175, 55, 0.25)',
};

// Specialty colors - Premium palette
export const specialtyColors = {
  'Software Engineering': '#1E3A5F',
  'Data Science & AI': '#6366F1',
  'Cloud Architecture': '#8B5CF6',
  'DevOps & Platform': '#2C5282',
  'Cybersecurity': '#D4AF37',
  'General': '#1E3A5F',
};

export const specialtyGradients = {
  'Software Engineering': 'linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%)',
  'Data Science & AI': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
  'Cloud Architecture': 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
  'DevOps & Platform': 'linear-gradient(135deg, #2C5282 0%, #3B82F6 100%)',
  'Cybersecurity': 'linear-gradient(135deg, #D4AF37 0%, #F0C850 100%)',
  'General': 'linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%)',
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

// Glassmorphism styles - Premium
export const glassmorphism = {
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 8px 32px 0 rgba(30, 58, 95, 0.08)',
};

// Premium shadow system
export const shadows = {
  sm: '0 2px 8px rgba(30, 58, 95, 0.06)',
  md: '0 4px 16px rgba(30, 58, 95, 0.08)',
  lg: '0 8px 24px rgba(30, 58, 95, 0.1)',
  xl: '0 12px 32px rgba(30, 58, 95, 0.12)',
  colored: {
    primary: '0 8px 24px rgba(30, 58, 95, 0.2)',
    secondary: '0 8px 24px rgba(99, 102, 241, 0.2)',
    purple: '0 8px 24px rgba(99, 102, 241, 0.2)',
    pink: '0 8px 24px rgba(212, 175, 55, 0.3)',
  },
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: healthcareColors.primary,
      light: '#2C5282',
      dark: '#0F1419',
      contrastText: '#fff',
    },
    secondary: {
      main: healthcareColors.secondary,
      light: '#8B5CF6',
      dark: '#4F46E5',
      contrastText: '#fff',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
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
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      fontSize: '1.875rem',
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    code: {
      fontFamily: 'Roboto Mono, monospace',
      fontSize: '0.875rem',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          padding: '12px 32px',
          fontWeight: 600,
          fontSize: '0.9375rem',
          boxShadow: 'none',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(30, 58, 95, 0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          background: healthcareColors.gradientPrimary,
          '&:hover': {
            background: healthcareColors.gradientPrimary,
            boxShadow: '0 4px 12px rgba(30, 58, 95, 0.25)',
          },
        },
        containedSecondary: {
          background: healthcareColors.gradientSecondary,
          '&:hover': {
            background: healthcareColors.gradientSecondary,
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid rgba(30, 58, 95, 0.06)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(30, 58, 95, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 8px rgba(30, 58, 95, 0.06)',
        },
        elevation1: {
          boxShadow: '0 1px 8px rgba(30, 58, 95, 0.06)',
        },
        elevation2: {
          boxShadow: '0 2px 12px rgba(30, 58, 95, 0.08)',
        },
        elevation3: {
          boxShadow: '0 4px 16px rgba(30, 58, 95, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.2s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: healthcareColors.primary,
              borderWidth: '1px',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: healthcareColors.primary,
              borderWidth: '2px',
              boxShadow: '0 0 0 3px rgba(30, 58, 95, 0.08)',
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
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid white',
          boxShadow: '0 2px 8px rgba(30, 58, 95, 0.12)',
        },
      },
    },
  },
});

export default theme;
