import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { drawerWidth } from './PremiumSidebar';

const PremiumTopBar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        backgroundColor: '#FFFFFF',
        boxShadow: '0 1px 3px rgba(30, 58, 95, 0.04)',
        borderBottom: '1px solid rgba(30, 58, 95, 0.08)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{
              display: { md: 'none' },
              color: '#1E3A5F',
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              color: '#1F2937',
              fontWeight: 600,
              fontSize: '1.125rem',
            }}
          >
            Welcome back, {user?.firstName || 'User'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            sx={{
              color: '#6B7280',
              '&:hover': {
                backgroundColor: 'rgba(30, 58, 95, 0.04)',
              },
            }}
          >
            <NotificationsIcon />
          </IconButton>

          <IconButton
            onClick={handleMenu}
            sx={{
              ml: 1,
              '&:hover': {
                backgroundColor: 'rgba(30, 58, 95, 0.04)',
              },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'linear-gradient(135deg, #1E3A5F 0%, #6366F1 100%)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {getInitials()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 180,
                borderRadius: 2,
                boxShadow: '0 4px 16px rgba(30, 58, 95, 0.12)',
              },
            }}
          >
            <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
              <PersonIcon sx={{ mr: 1.5, fontSize: 20, color: '#6B7280' }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: '#EF4444' }}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default PremiumTopBar;
