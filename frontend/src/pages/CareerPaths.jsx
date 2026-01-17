import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ArrowUpward as ArrowUpwardIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { careerPathsAPI, userSkillsAPI } from '../services/api';
import { getUserId } from '../utils/userHelpers';
import PremiumSidebar from '../components/PremiumSidebar';
import PremiumTopBar from '../components/PremiumTopBar';
import PageTransition from '../components/PageTransition';
import { healthcareColors, shadows } from '../theme';

const salaryTiers = {
  entry: { min: 0, max: 70000, label: 'Entry Level', color: '#6366F1', icon: '🚀' },
  mid: { min: 70000, max: 100000, label: 'Mid Level', color: '#8B5CF6', icon: '⭐' },
  senior: { min: 100000, max: 150000, label: 'Senior Level', color: '#1E3A5F', icon: '💎' },
  executive: { min: 150000, max: Infinity, label: 'Executive Level', color: '#D4AF37', icon: '👑' },
};

const CareerPaths = () => {
  const { user } = useAuth();
  const [careerPaths, setCareerPaths] = useState([]);
  const [filteredPaths, setFilteredPaths] = useState([]);
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchCareerPaths();
    fetchUserSkills();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCareerPaths = async () => {
    try {
      setLoading(true);
      const response = await careerPathsAPI.getAllCareerPaths();
      const paths = response.data.careerPaths || [];
      setCareerPaths(paths);
      setFilteredPaths(paths);
    } catch (error) {
      console.error('Error fetching career paths:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSkills = async () => {
    const userId = getUserId(user);
    if (!userId) return;
    try {
      const response = await userSkillsAPI.getAllUserSkills({ userId });
      setUserSkills(response.data.userSkills || []);
    } catch (error) {
      console.error('Error fetching user skills:', error);
    }
  };

  const handleTierChange = (event, newValue) => {
    setSelectedTier(newValue);
    if (newValue === 'all') {
      setFilteredPaths(careerPaths);
    } else {
      const tier = salaryTiers[newValue];
      const filtered = careerPaths.filter((path) => {
        const salary = path.salaryRange?.min || 0;
        return salary >= tier.min && salary < tier.max;
      });
      setFilteredPaths(filtered);
    }
  };

  const calculateReadiness = (career) => {
    if (!career.requiredSkills || career.requiredSkills.length === 0) return 0;

    let totalRequired = 0;
    let userMet = 0;

    career.requiredSkills.forEach((reqSkill) => {
      const skillId = reqSkill.skillId?._id || reqSkill.skillId;
      const userSkill = userSkills.find((us) => us.skillId?._id === skillId || us.skillId === skillId);
      const userLevel = userSkill?.proficiency?.level || 'beginner';
      const requiredLevel = reqSkill.requiredLevel || 'intermediate';

      const levels = { beginner: 1, intermediate: 2, advanced: 3, expert: 4, master: 5 };
      const userScore = levels[userLevel.toLowerCase()] || 0;
      const requiredScore = levels[requiredLevel.toLowerCase()] || 0;

      totalRequired += requiredScore;
      userMet += Math.min(userScore, requiredScore);
    });

    return totalRequired > 0 ? Math.round((userMet / totalRequired) * 100) : 0;
  };

  const getTierForSalary = (salary) => {
    if (salary < salaryTiers.mid.min) return 'entry';
    if (salary < salaryTiers.senior.min) return 'mid';
    if (salary < salaryTiers.executive.min) return 'senior';
    return 'executive';
  };

  if (loading && careerPaths.length === 0) {
    return (
      <PageTransition>
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: healthcareColors.background }}>
          <PremiumSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <PremiumTopBar onMenuClick={() => setSidebarOpen(true)} />
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress size={60} sx={{ color: healthcareColors.primary }} />
                <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
                  Loading career paths...
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: healthcareColors.background }}>
        <PremiumSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <PremiumTopBar onMenuClick={() => setSidebarOpen(true)} />
          
          <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
            <Container maxWidth="xl">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ mb: 5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        background: healthcareColors.gradientPrimary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: shadows.colored.primary,
                      }}
                    >
                      <TrendingUpIcon sx={{ fontSize: 32, color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: healthcareColors.dark, mb: 0.5 }}>
                        Career Progression
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Explore premium career opportunities tailored to your skills
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>

              {/* Tier Selector */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card
                  sx={{
                    mb: 4,
                    borderRadius: 4,
                    background: 'white',
                    boxShadow: shadows.md,
                    border: '1px solid rgba(30, 58, 95, 0.06)',
                  }}
                >
                  <Box sx={{ borderBottom: '1px solid rgba(30, 58, 95, 0.06)' }}>
                    <Tabs
                      value={selectedTier}
                      onChange={handleTierChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{
                        px: 2,
                        '& .MuiTab-root': {
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.9375rem',
                          py: 2.5,
                          minHeight: 'auto',
                        },
                        '& .Mui-selected': {
                          color: healthcareColors.primary,
                        },
                        '& .MuiTabs-indicator': {
                          backgroundColor: healthcareColors.accent,
                          height: 3,
                        },
                      }}
                    >
                      <Tab 
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>All Tiers</span>
                            <Chip 
                              label={careerPaths.length} 
                              size="small" 
                              sx={{ 
                                bgcolor: selectedTier === 'all' ? healthcareColors.primary : 'rgba(30, 58, 95, 0.1)',
                                color: selectedTier === 'all' ? 'white' : 'text.secondary',
                                fontWeight: 600,
                                height: 22,
                              }} 
                            />
                          </Box>
                        }
                        value="all" 
                      />
                      {Object.entries(salaryTiers).map(([key, tier]) => (
                        <Tab
                          key={key}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span>{tier.icon}</span>
                              <span>{tier.label}</span>
                              <Chip 
                                label={careerPaths.filter(p => getTierForSalary(p.salaryRange?.min || 0) === key).length}
                                size="small"
                                sx={{ 
                                  bgcolor: selectedTier === key ? tier.color : 'rgba(30, 58, 95, 0.1)',
                                  color: selectedTier === key ? 'white' : 'text.secondary',
                                  fontWeight: 600,
                                  height: 22,
                                }}
                              />
                            </Box>
                          }
                          value={key}
                        />
                      ))}
                    </Tabs>
                  </Box>
                </Card>
              </motion.div>

              {/* Career Cards Grid */}
              <Box>
                {filteredPaths.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card
                      sx={{
                        p: 8,
                        textAlign: 'center',
                        borderRadius: 4,
                        background: 'white',
                        boxShadow: shadows.sm,
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                        No career paths found in this tier
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => handleTierChange(null, 'all')}
                        sx={{
                          background: healthcareColors.gradientPrimary,
                          px: 4,
                          py: 1.5,
                        }}
                      >
                        View All Career Paths
                      </Button>
                    </Card>
                  </motion.div>
                ) : (
                  <Grid container spacing={3}>
                    <AnimatePresence mode="popLayout">
                      {filteredPaths.map((career, index) => {
                        const readiness = calculateReadiness(career);
                        const tierKey = getTierForSalary(career.salaryRange?.min || 0);
                        const tier = salaryTiers[tierKey];

                        return (
                          <Grid item xs={12} sm={6} lg={4} key={career._id}>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ 
                                delay: index * 0.05,
                                duration: 0.4,
                                ease: [0.4, 0, 0.2, 1]
                              }}
                              whileHover={{ y: -8 }}
                              style={{ height: '100%' }}
                            >
                              <Card
                                sx={{
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  borderRadius: 4,
                                  background: 'white',
                                  border: `1px solid rgba(30, 58, 95, 0.06)`,
                                  boxShadow: shadows.md,
                                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                  position: 'relative',
                                  overflow: 'visible',
                                  '&:hover': {
                                    boxShadow: shadows.xl,
                                    borderColor: tier.color,
                                  },
                                }}
                              >
                                {/* Tier Badge */}
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: -12,
                                    right: 20,
                                    bgcolor: tier.color,
                                    color: 'white',
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 2,
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    boxShadow: `0 4px 12px ${tier.color}40`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                  }}
                                >
                                  <span>{tier.icon}</span>
                                  <span>{tier.label.toUpperCase()}</span>
                                </Box>

                                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 4 }}>
                                  {/* Career Title */}
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: 700,
                                      mb: 1.5,
                                      color: healthcareColors.dark,
                                      lineHeight: 1.3,
                                    }}
                                  >
                                    {career.title}
                                  </Typography>

                                  {/* Specialty Badge */}
                                  <Box sx={{ mb: 2 }}>
                                    <Chip
                                      label={career.healthcareSpecialty || 'General'}
                                      size="small"
                                      sx={{
                                        bgcolor: `${tier.color}15`,
                                        color: tier.color,
                                        fontWeight: 600,
                                        borderRadius: 2,
                                      }}
                                    />
                                  </Box>

                                  {/* Description */}
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: 'text.secondary',
                                      mb: 3,
                                      flexGrow: 1,
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    {career.description?.substring(0, 120)}
                                    {career.description?.length > 120 ? '...' : ''}
                                  </Typography>

                                  {/* Salary Range */}
                                  <Box
                                    sx={{
                                      p: 2,
                                      borderRadius: 3,
                                      background: `linear-gradient(135deg, ${tier.color}08 0%, ${tier.color}15 100%)`,
                                      mb: 3,
                                      border: `1px solid ${tier.color}20`,
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                      <MoneyIcon sx={{ fontSize: 18, color: healthcareColors.accent }} />
                                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        Salary Range
                                      </Typography>
                                    </Box>
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 700,
                                        background: `linear-gradient(135deg, ${tier.color} 0%, ${healthcareColors.accent} 100%)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                      }}
                                    >
                                      ${career.salaryRange?.min?.toLocaleString()} - ${career.salaryRange?.max?.toLocaleString()}
                                    </Typography>
                                  </Box>

                                  {/* Required Skills */}
                                  <Box sx={{ mb: 2.5 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                      Required Skills ({career.requiredSkills?.length || 0})
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                      {career.requiredSkills?.slice(0, 3).map((skill, idx) => (
                                        <Chip
                                          key={idx}
                                          label={skill.skillId?.name || skill.name || 'Skill'}
                                          size="small"
                                          sx={{
                                            bgcolor: 'rgba(30, 58, 95, 0.06)',
                                            color: 'text.secondary',
                                            fontSize: '0.75rem',
                                            height: 26,
                                            fontWeight: 500,
                                          }}
                                        />
                                      ))}
                                      {career.requiredSkills?.length > 3 && (
                                        <Chip
                                          label={`+${career.requiredSkills.length - 3} more`}
                                          size="small"
                                          sx={{
                                            bgcolor: healthcareColors.primary,
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            height: 26,
                                            fontWeight: 600,
                                          }}
                                        />
                                      )}
                                    </Box>
                                  </Box>

                                  {/* Readiness Progress */}
                                  <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        Your Readiness
                                      </Typography>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        {readiness >= 80 ? (
                                          <CheckCircleIcon sx={{ fontSize: 16, color: '#10B981' }} />
                                        ) : readiness >= 50 ? (
                                          <ArrowUpwardIcon sx={{ fontSize: 16, color: '#F59E0B' }} />
                                        ) : (
                                          <CancelIcon sx={{ fontSize: 16, color: '#EF4444' }} />
                                        )}
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            fontWeight: 700,
                                            color: readiness >= 80 ? '#10B981' : readiness >= 50 ? '#F59E0B' : '#EF4444',
                                          }}
                                        >
                                          {readiness}%
                                        </Typography>
                                      </Box>
                                    </Box>
                                    <LinearProgress
                                      variant="determinate"
                                      value={readiness}
                                      sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: 'rgba(30, 58, 95, 0.08)',
                                        '& .MuiLinearProgress-bar': {
                                          borderRadius: 4,
                                          background:
                                            readiness >= 80
                                              ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                                              : readiness >= 50
                                              ? 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)'
                                              : 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)',
                                        },
                                      }}
                                    />
                                  </Box>

                                  {/* Action Button */}
                                  <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => setSelectedCareer(career)}
                                    sx={{
                                      mt: 3,
                                      py: 1.5,
                                      background: healthcareColors.gradientPrimary,
                                      fontWeight: 600,
                                      fontSize: '0.9375rem',
                                      borderRadius: 2.5,
                                      boxShadow: 'none',
                                      '&:hover': {
                                        background: healthcareColors.gradientPrimary,
                                        boxShadow: shadows.colored.primary,
                                        transform: 'translateY(-2px)',
                                      },
                                      transition: 'all 0.2s ease',
                                    }}
                                    endIcon={<ArrowUpwardIcon />}
                                  >
                                    View Details
                                  </Button>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </Grid>
                        );
                      })}
                    </AnimatePresence>
                  </Grid>
                )}
              </Box>

              {/* Career Details Modal */}
              <AnimatePresence>
                {selectedCareer && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 1300,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      backdropFilter: 'blur(4px)',
                      padding: '24px',
                    }}
                    onClick={() => setSelectedCareer(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.9, opacity: 0, y: 20 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        maxWidth: '800px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                      }}
                    >
                      <Card
                        sx={{
                          borderRadius: 4,
                          background: 'white',
                          boxShadow: shadows.xl,
                        }}
                      >
                        {/* Modal Header */}
                        <Box
                          sx={{
                            p: 4,
                            background: healthcareColors.gradientPrimary,
                            color: 'white',
                            position: 'relative',
                          }}
                        >
                          <IconButton
                            onClick={() => setSelectedCareer(null)}
                            sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              color: 'white',
                              bgcolor: 'rgba(255, 255, 255, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                              },
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Box
                              sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 3,
                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <StarIcon sx={{ fontSize: 32 }} />
                            </Box>
                            <Box>
                              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                {selectedCareer.title}
                              </Typography>
                              <Chip
                                label={selectedCareer.healthcareSpecialty || 'General'}
                                sx={{
                                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                                  color: 'white',
                                  fontWeight: 600,
                                  backdropFilter: 'blur(10px)',
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>

                        {/* Modal Content */}
                        <Box sx={{ p: 4 }}>
                          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.8 }}>
                            {selectedCareer.description}
                          </Typography>

                          <Grid container spacing={3}>
                            {/* Salary Information */}
                            <Grid item xs={12} md={6}>
                              <Card
                                sx={{
                                  p: 3,
                                  borderRadius: 3,
                                  background: `linear-gradient(135deg, ${healthcareColors.accent}15 0%, ${healthcareColors.accent}08 100%)`,
                                  border: `1px solid ${healthcareColors.accent}30`,
                                }}
                              >
                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1.5, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                  💰 Compensation Package
                                </Typography>
                                <Typography
                                  variant="h4"
                                  sx={{
                                    fontWeight: 700,
                                    background: `linear-gradient(135deg, ${healthcareColors.primary} 0%, ${healthcareColors.accent} 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                  }}
                                >
                                  ${selectedCareer.salaryRange?.min?.toLocaleString()} - ${selectedCareer.salaryRange?.max?.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                  Annual salary range
                                </Typography>
                              </Card>
                            </Grid>

                            {/* Readiness Score */}
                            <Grid item xs={12} md={6}>
                              <Card
                                sx={{
                                  p: 3,
                                  borderRadius: 3,
                                  background: `linear-gradient(135deg, ${healthcareColors.secondary}15 0%, ${healthcareColors.secondary}08 100%)`,
                                  border: `1px solid ${healthcareColors.secondary}30`,
                                }}
                              >
                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1.5, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                  ⚡ Your Readiness
                                </Typography>
                                <Typography
                                  variant="h4"
                                  sx={{
                                    fontWeight: 700,
                                    color: healthcareColors.secondary,
                                  }}
                                >
                                  {calculateReadiness(selectedCareer)}%
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                  Skills match score
                                </Typography>
                              </Card>
                            </Grid>

                            {/* Required Skills */}
                            <Grid item xs={12}>
                              <Card
                                sx={{
                                  p: 3,
                                  borderRadius: 3,
                                  background: 'rgba(30, 58, 95, 0.02)',
                                  border: '1px solid rgba(30, 58, 95, 0.08)',
                                }}
                              >
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: healthcareColors.dark }}>
                                  🎯 Required Skills
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                  {selectedCareer.requiredSkills?.map((skill, idx) => {
                                    const skillId = skill.skillId?._id || skill.skillId;
                                    const userSkill = userSkills.find((us) => us.skillId?._id === skillId || us.skillId === skillId);
                                    const hasSkill = !!userSkill;

                                    return (
                                      <Chip
                                        key={idx}
                                        label={skill.skillId?.name || skill.name || 'Skill'}
                                        icon={hasSkill ? <CheckCircleIcon /> : <CancelIcon />}
                                        sx={{
                                          bgcolor: hasSkill ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                          color: hasSkill ? '#10B981' : '#EF4444',
                                          fontWeight: 600,
                                          fontSize: '0.875rem',
                                          py: 2.5,
                                          '& .MuiChip-icon': {
                                            color: hasSkill ? '#10B981' : '#EF4444',
                                          },
                                        }}
                                      />
                                    );
                                  })}
                                </Box>
                              </Card>
                            </Grid>
                          </Grid>

                          {/* Action Buttons */}
                          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                            <Button
                              fullWidth
                              variant="outlined"
                              onClick={() => setSelectedCareer(null)}
                              sx={{
                                py: 1.5,
                                borderRadius: 2.5,
                                borderColor: 'rgba(30, 58, 95, 0.2)',
                                color: 'text.secondary',
                                fontWeight: 600,
                                '&:hover': {
                                  borderColor: healthcareColors.primary,
                                  bgcolor: 'rgba(30, 58, 95, 0.04)',
                                },
                              }}
                            >
                              Close
                            </Button>
                            <Button
                              fullWidth
                              variant="contained"
                              onClick={() => {
                                setSnackbar({
                                  open: true,
                                  message: `${selectedCareer.title} set as your career goal! Start building your skills towards this role.`,
                                  severity: 'success'
                                });
                                setSelectedCareer(null);
                              }}
                              sx={{
                                py: 1.5,
                                background: healthcareColors.gradientPrimary,
                                fontWeight: 600,
                                borderRadius: 2.5,
                                boxShadow: shadows.colored.primary,
                                '&:hover': {
                                  boxShadow: shadows.colored.primary,
                                  transform: 'translateY(-2px)',
                                },
                              }}
                              startIcon={<StarIcon />}
                            >
                              Set as Career Goal
                            </Button>
                          </Box>
                        </Box>
                      </Card>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Snackbar */}
              <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <Alert
                  onClose={() => setSnackbar({ ...snackbar, open: false })}
                  severity={snackbar.severity}
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    boxShadow: shadows.lg,
                    '& .MuiAlert-icon': {
                      fontSize: 24,
                    },
                  }}
                >
                  {snackbar.message}
                </Alert>
              </Snackbar>
            </Container>
          </Box>
        </Box>
      </Box>
    </PageTransition>
  );
};

export default CareerPaths;
