import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import theme from './theme';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import SkillsAssessment from './pages/SkillsAssessment.jsx';
import CareerPaths from './pages/CareerPaths.jsx';
import Recommendations from './pages/Recommendations.jsx';
import GapAnalysis from './pages/GapAnalysis.jsx';
import CourseRecommendations from './pages/CourseRecommendations.jsx';
import NotFound from './pages/NotFound.jsx';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const { isInitialized } = useAuth();

  // Show app-level loading spinner while auth is initializing
  if (!isInitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Box sx={{ color: 'text.secondary', fontSize: '1rem' }}>
          Loading application...
        </Box>
      </Box>
    );
  }
  
  return (
    <div className="App">
      {!isDashboard && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <SkillsAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-paths"
            element={
              <ProtectedRoute>
                <CareerPaths />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <Recommendations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gap-analysis"
            element={
              <ProtectedRoute>
                <GapAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course-recommendations"
            element={
              <ProtectedRoute>
                <CourseRecommendations />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
