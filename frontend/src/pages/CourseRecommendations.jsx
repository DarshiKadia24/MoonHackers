import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  School as SchoolIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { analysisAPI, careerPathsAPI } from '../services/api';
import PageTransition from '../components/PageTransition';
import SkeletonLoader from '../components/SkeletonLoader';
import { healthcareColors, glassmorphism } from '../theme';

const CourseRecommendations = () => {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCareerPaths();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedRoleId) {
      fetchRecommendations();
    }
  }, [selectedRoleId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCareerPaths = async () => {
    try {
      const response = await careerPathsAPI.getAllCareerPaths();
      if (response.data.careerPaths && response.data.careerPaths.length > 0) {
        setSelectedRoleId(response.data.careerPaths[0]._id);
      }
    } catch (error) {
      console.error('Error fetching career paths:', error);
    }
  };

  const fetchRecommendations = async () => {
    if (!selectedRoleId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await analysisAPI.getRecommendations({ targetRoleId: selectedRoleId });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError(error.response?.data?.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#d32f2f';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const filteredRecommendations = () => {
    if (!recommendations?.recommendations) return [];
    
    if (activeTab === 0) {
      return recommendations.recommendations; // All
    } else if (activeTab === 1) {
      return recommendations.recommendations.filter(r => r.gapSeverity === 'critical');
    } else if (activeTab === 2) {
      return recommendations.recommendations.filter(r => r.gapSeverity === 'high');
    }
    return recommendations.recommendations;
  };

  if (loading && !recommendations) {
    return (
      <PageTransition>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <SkeletonLoader variant="rectangular" width="100%" height={400} count={3} />
        </Container>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2, color: healthcareColors.primary }}>
              <SchoolIcon sx={{ mr: 2, fontSize: 'inherit', verticalAlign: 'middle' }} />
              Personalized Course Recommendations
            </Typography>
            {recommendations?.summary && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  label={`${recommendations.summary.totalCoursesRecommended} Courses Recommended`}
                  color="primary"
                  icon={<SchoolIcon />}
                />
                <Chip
                  label={`${recommendations.summary.criticalSkillsToAddress} Critical Skills`}
                  sx={{ bgcolor: '#d32f2f', color: 'white' }}
                />
                <Chip
                  label={`${recommendations.summary.freeCourses} Free Courses`}
                  color="success"
                />
                {recommendations.summary.estimatedTotalCost > 0 && (
                  <Chip
                    label={`$${recommendations.summary.estimatedTotalCost} Total Cost`}
                    icon={<MoneyIcon />}
                  />
                )}
              </Box>
            )}
          </Box>
        </motion.div>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {recommendations && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="All Recommendations" />
                <Tab label="Critical Gaps" />
                <Tab label="High Priority" />
              </Tabs>
            </Box>

            <AnimatePresence mode="wait">
              <Grid container spacing={3}>
                {filteredRecommendations().map((rec, index) => (
                  <Grid item xs={12} key={rec.skillId || index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card sx={{ mb: 3, ...glassmorphism }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                            <Box>
                              <Typography variant="h6" gutterBottom>
                                {rec.skill}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <Chip
                                  label={rec.gapSeverity}
                                  size="small"
                                  sx={{
                                    bgcolor: getSeverityColor(rec.gapSeverity),
                                    color: 'white',
                                    fontWeight: 600,
                                  }}
                                />
                                <Chip label={rec.category} size="small" variant="outlined" />
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                Current: {rec.currentLevel} → Required: {rec.requiredLevel} ({rec.gapPercentage}% gap)
                              </Typography>
                            </Box>
                          </Box>

                          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
                            Recommended Courses:
                          </Typography>
                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            {rec.courses.map((course, courseIndex) => (
                              <Grid item xs={12} md={6} key={course._id || courseIndex}>
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Card
                                    variant="outlined"
                                    sx={{
                                      height: '100%',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      border: `2px solid ${healthcareColors.light}`,
                                      '&:hover': {
                                        borderColor: healthcareColors.primary,
                                        boxShadow: '0 4px 20px rgba(13, 71, 161, 0.15)',
                                      },
                                    }}
                                  >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                                          {course.title}
                                        </Typography>
                                        {course.matchScore && (
                                          <Chip
                                            label={`${course.matchScore}% Match`}
                                            size="small"
                                            color="primary"
                                          />
                                        )}
                                      </Box>
                                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {course.description || 'No description available'}
                                      </Typography>
                                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                                        {course.provider && (
                                          <Chip label={course.provider} size="small" variant="outlined" />
                                        )}
                                        {course.duration && (
                                          <Chip
                                            icon={<TimeIcon />}
                                            label={course.duration}
                                            size="small"
                                            variant="outlined"
                                          />
                                        )}
                                        {course.cost !== undefined && (
                                          <Chip
                                            icon={<MoneyIcon />}
                                            label={course.cost === 0 ? 'Free' : `$${course.cost}`}
                                            size="small"
                                            color={course.cost === 0 ? 'success' : 'default'}
                                          />
                                        )}
                                        {course.difficulty && (
                                          <Chip
                                            label={course.difficulty}
                                            size="small"
                                            sx={{
                                              bgcolor: course.difficulty === 'advanced' ? '#d32f2f' :
                                                      course.difficulty === 'intermediate' ? '#ff9800' : '#4caf50',
                                              color: 'white',
                                            }}
                                          />
                                        )}
                                      </Box>
                                      {course.whyRecommended && course.whyRecommended.length > 0 && (
                                        <Box sx={{ mt: 1 }}>
                                          <Typography variant="caption" color="text.secondary">
                                            Why recommended:
                                          </Typography>
                                          <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                                            {course.whyRecommended.map((reason, idx) => (
                                              <li key={idx}>
                                                <Typography variant="caption" color="text.secondary">
                                                  {reason}
                                                </Typography>
                                              </li>
                                            ))}
                                          </ul>
                                        </Box>
                                      )}
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                                      {course.url && (
                                        <Button
                                          size="small"
                                          variant="contained"
                                          endIcon={<LaunchIcon />}
                                          href={course.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          sx={{ bgcolor: healthcareColors.primary }}
                                        >
                                          Enroll
                                        </Button>
                                      )}
                                    </CardActions>
                                  </Card>
                                </motion.div>
                              </Grid>
                            ))}
                          </Grid>

                          {rec.learningPath && rec.learningPath.length > 0 && (
                            <Box sx={{ mt: 3, p: 2, bgcolor: healthcareColors.light + '40', borderRadius: 2 }}>
                              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                                Learning Path for {rec.skill}:
                              </Typography>
                              {rec.learningPath.map((phase, phaseIndex) => (
                                <Box key={phaseIndex} sx={{ mt: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {phase.phase} ({phase.estimatedTime})
                                  </Typography>
                                  <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                                    {phase.actions.map((action, actionIndex) => (
                                      <li key={actionIndex}>
                                        <Typography variant="caption" color="text.secondary">
                                          {action}
                                        </Typography>
                                      </li>
                                    ))}
                                  </ul>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </AnimatePresence>
          </>
        )}
      </Container>
    </PageTransition>
  );
};

export default CourseRecommendations;
