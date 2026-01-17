import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  LocalHospital as LogoIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  School as SkillsIcon,
  TrendingUp as CareerIcon,
  Recommend as RecommendIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { glassmorphism, healthcareColors } from '../theme';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = isAuthenticated ? [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Profile', path: '/profile', icon: <PersonIcon /> },
    { label: 'Skills', path: '/skills', icon: <SkillsIcon /> },
    { label: 'Career Paths', path: '/career-paths', icon: <CareerIcon /> },
    { label: 'Recommendations', path: '/recommendations', icon: <RecommendIcon /> },
  ] : [
    { label: 'Login', path: '/login' },
    { label: 'Register', path: '/register' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', pt: 2 }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 700, color: 'primary.main' }}>
        <LogoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Healthcare Skills
      </Typography>
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton
              component={Link}
              to={link.path}
              sx={{ textAlign: 'center', py: 1.5 }}
            >
              {link.icon && <Box sx={{ mr: 1, display: 'flex' }}>{link.icon}</Box>}
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ textAlign: 'center', py: 1.5 }}>
              <LogoutIcon sx={{ mr: 1 }} />
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          ...glassmorphism,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(13, 71, 161, 0.1)',
          boxShadow: '0 4px 20px rgba(13, 71, 161, 0.08)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <LogoIcon
              sx={{
                fontSize: 32,
                color: 'primary.main',
                mr: 1.5,
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                fontWeight: 700,
                background: healthcareColors.gradientPrimary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              Healthcare Skills Intelligence
            </Typography>
          </Box>
          {isMobile ? (
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  startIcon={link.icon}
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    px: 2,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: healthcareColors.gradientCard,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}
              {isAuthenticated && (
                <Button
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    px: 2,
                    borderRadius: 2,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: healthcareColors.gradientPrimary,
                      color: 'white',
                      borderColor: 'transparent',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Logout
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
