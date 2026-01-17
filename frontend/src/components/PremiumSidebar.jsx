import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Lightbulb as LightbulbIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { healthcareColors } from '../theme';

export const drawerWidth = 260;

const PremiumSidebar = ({ open, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Skills Assessment', icon: <AssessmentIcon />, path: '/skills' },
    { text: 'Career Paths', icon: <TrendingUpIcon />, path: '/career-paths' },
    { text: 'Gap Analysis', icon: <LightbulbIcon />, path: '/gap-analysis' },
    { text: 'Courses', icon: <MenuBookIcon />, path: '/course-recommendations' },
    { text: 'Recommendations', icon: <SchoolIcon />, path: '/recommendations' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
        borderRight: '1px solid rgba(30, 58, 95, 0.08)',
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #1E3A5F 0%, #6366F1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Skill Intelligence
        </Typography>
        <Typography variant="caption" sx={{ color: '#6B7280', mt: 0.5, display: 'block' }}>
          Premium Platform
        </Typography>
      </Box>

      <Divider sx={{ opacity: 0.6 }} />

      <List sx={{ px: 2, py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={onClose}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  transition: 'all 0.2s ease',
                  backgroundColor: isActive ? 'rgba(30, 58, 95, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive
                      ? 'rgba(30, 58, 95, 0.12)'
                      : 'rgba(30, 58, 95, 0.04)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? healthcareColors.primary : '#6B7280',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9375rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? healthcareColors.primary : '#374151',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ opacity: 0.6 }} />

      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            py: 1.5,
            px: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              transform: 'translateX(4px)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: '#EF4444' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: '#EF4444',
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default PremiumSidebar;
