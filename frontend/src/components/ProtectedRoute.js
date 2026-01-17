import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Container, Typography, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import SkeletonLoader from './SkeletonLoader';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, error, isInitialized } = useAuth();
  const location = useLocation();

  // Show loading skeleton while auth is initializing
  if (loading || !isInitialized) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <SkeletonLoader variant="rectangular" height={60} width="100%" />
          <Box sx={{ mt: 3 }}>
            <SkeletonLoader variant="rectangular" height={200} width="100%" />
          </Box>
          <Box sx={{ mt: 3 }}>
            <SkeletonLoader variant="rectangular" height={150} width="100%" count={2} />
          </Box>
        </Box>
      </Container>
    );
  }

  // Show error message if there's an auth error
  if (error && !isAuthenticated) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Authentication Error
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Please try logging in again.
          </Typography>
        </Box>
      </Container>
    );
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
