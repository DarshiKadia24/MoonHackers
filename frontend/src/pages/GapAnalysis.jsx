import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  
  CircularProgress,
  Alert,
  Button,
  Chip,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  MedicalServices as MedicalIcon,
  Warning as WarningIcon,
  
  Timeline as TimelineIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { slideIn, stagger } from '../utils/animeHelper';
// // import { useAuth } from '../context/AuthContext';
import { careerPathsAPI } from '../services/api';
// // import { getUserId } from '../utils/userHelpers';
import PageTransition from '../components/PageTransition';
import SkeletonLoader from '../components/SkeletonLoader';
import { healthcareColors, glassmorphism } from '../theme';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const GapAnalysis = () => {
  // const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [careerPaths, setCareerPaths] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [error, setError] = useState(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const criticalGapsRef = useRef(null);

  useEffect(() => {
    fetchCareerPaths();
  }, []);

  const fetchCareerPaths = async () => {
    try {
      const response = await careerPathsAPI.getAllCareerPaths();
      setCareerPaths(response.data.careerPaths || []);
      if (response.data.careerPaths && response.data.careerPaths.length > 0) {
        setSelectedRoleId(response.data.careerPaths[0]._id);
      }
    } catch (error) {
      console.error('Error fetching career paths:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedRoleId) {
      setError('Please select a target role');
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);
      const token = localStorage.getItem('token');

      const response = await fetch('/api/analysis/gap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ targetRoleId: selectedRoleId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error analyzing gaps:', error);
      setError(error.message || 'Failed to analyze skill gaps');
    } finally {
      setAnalyzing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRoleId) {
      handleAnalyze();
    }
  }, [selectedRoleId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (headerRef.current) {
      setTimeout(() => {
        if (headerRef.current) {
          slideIn(headerRef.current, 'down', { 
            duration: 800,
            easing: 'easeOutElastic(1, .8)',
          });
        }
      }, 50);
    }
  }, []);

  useEffect(() => {
    if (analysis && !analyzing) {
      setTimeout(() => {
        const validCards = cardsRef.current.filter(card => card !== null && card !== undefined);
        if (validCards.length > 0) {
          stagger(validCards, { 
            staggerDelay: 120,
            duration: 800,
            easing: 'easeOutElastic(1, .8)',
          });
        }
        if (criticalGapsRef.current) {
          slideIn(criticalGapsRef.current, 'right', { 
            delay: 400,
            duration: 800,
            easing: 'easeOutElastic(1, .8)',
          });
        }
      }, 100);
    }
  }, [analysis, analyzing]);

  const prepareRadarData = (gapsByCategory) => {
    if (!gapsByCategory || Object.keys(gapsByCategory).length === 0) {
      return {
        labels: ['Clinical', 'Technical', 'Regulatory', 'Analytical', 'Soft Skills'],
        datasets: [{
          label: 'Gap Percentage',
          data: [0, 0, 0, 0, 0],
          backgroundColor: 'rgba(13, 71, 161, 0.2)',
          borderColor: 'rgba(13, 71, 161, 1)',
          borderWidth: 2,
        }],
      };
    }

    const categories = ['Clinical', 'Technical', 'Regulatory', 'Analytical', 'Soft Skills'];
    const data = categories.map(category => {
      const categoryData = gapsByCategory[category];
      return categoryData ? categoryData.averageGapPercentage : 0;
    });

    return {
      labels: categories,
      datasets: [{
        label: 'Average Gap Percentage',
        data: data,
        backgroundColor: 'rgba(13, 71, 161, 0.2)',
        borderColor: 'rgba(13, 71, 161, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(13, 71, 161, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(13, 71, 161, 1)',
      }],
    };
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

  if (loading && !analysis) {
    return (
      <PageTransition>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SkeletonLoader variant="rectangular" width="100%" height={400} />
          </Box>
        </Container>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box 
          ref={headerRef} 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            opacity: 0,
            transform: 'translateY(-30px)',
            willChange: 'transform, opacity',
          }}
        >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: healthcareColors.primary }}>
              <MedicalIcon sx={{ mr: 2, fontSize: 'inherit', verticalAlign: 'middle' }} />
              Skill Gap Analysis
            </Typography>
            <FormControl sx={{ minWidth: 250 }}>
              <InputLabel>Select Target Role</InputLabel>
              <Select
                value={selectedRoleId || ''}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                label="Select Target Role"
              >
                {careerPaths.map((path) => (
                  <MenuItem key={path._id} value={path._id}>
                    {path.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {analyzing && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={60} sx={{ color: healthcareColors.primary }} />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Analyzing your skills...
            </Typography>
          </Box>
        )}

        {analysis && !analyzing && (
          <Box sx={{ opacity: 0 }}>
            <Grid container spacing={3}>
              {/* Readiness Score Card */}
              <Grid item xs={12} md={4}>
                <div 
                  ref={el => {
                    if (el && el.nodeType === 1) cardsRef.current[0] = el;
                  }}
                  style={{
                    opacity: 0,
                    transform: 'translateY(40px) scale(0.9)',
                    willChange: 'transform, opacity',
                  }}
                >
                  <Card sx={{ p: 3, height: '100%', ...glassmorphism }}>
                    <Typography variant="h6" gutterBottom>
                      Readiness Score
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="center" my={3}>
                      <Box position="relative" display="inline-flex">
                        <CircularProgress
                          variant="determinate"
                          value={analysis.readinessScore}
                          size={120}
                          thickness={4}
                          sx={{
                            color: analysis.readinessScore >= 70 ? '#4caf50' :
                                   analysis.readinessScore >= 50 ? '#ff9800' : '#f44336',
                          }}
                        />
                        <Box
                          top={0}
                          left={0}
                          bottom={0}
                          right={0}
                          position="absolute"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Typography variant="h4" component="div">
                            {analysis.readinessScore}%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {analysis.summary.message}
                    </Typography>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Chip
                        label={analysis.targetRole?.title || 'Target Role'}
                        color="primary"
                        size="small"
                      />
                    </Box>
                  </Card>
                </div>
              </Grid>

              {/* Critical Gaps Alert */}
              <Grid item xs={12} md={8}>
                <div 
                  ref={criticalGapsRef}
                  style={{
                    opacity: 0,
                    transform: 'translateX(40px)',
                    willChange: 'transform, opacity',
                  }}
                >
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      <WarningIcon sx={{ mr: 1, color: '#f44336', verticalAlign: 'middle' }} />
                      Critical Gaps ({analysis.criticalGaps})
                    </Typography>
                    {analysis.criticalGaps > 0 ? (
                      <>
                        <Alert severity="error" sx={{ mb: 2 }}>
                          Immediate attention required for {analysis.criticalGaps} critical skills
                        </Alert>
                        <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                          {analysis.gaps
                            .filter(gap => gap.gapSeverity === 'critical')
                            .map((gap, index) => (
                              <Box key={gap.skillId} sx={{ mb: 1, p: 1, bgcolor: '#ffebee', borderRadius: 1, opacity: 0 }}>
                                  <Typography variant="body2">
                                    <strong>{gap.skillName}</strong> - {gap.currentLevel} → {gap.requiredLevel}
                                  </Typography>
                                  <LinearProgress
                                    variant="determinate"
                                    value={gap.gapPercentage}
                                    sx={{ mt: 0.5, height: 8, borderRadius: 4 }}
                                    color="error"
                                  />
                                </Box>
                            ))}
                        </Box>
                      </>
                    ) : (
                      <Alert severity="success">
                        No critical gaps found! You're on track for this role.
                      </Alert>
                    )}
                  </Card>
                </div>
              </Grid>

              {/* Skill Radar Chart */}
              <Grid item xs={12} md={6}>
                <div 
                  ref={el => {
                    if (el && el.nodeType === 1) cardsRef.current[1] = el;
                  }}
                  style={{
                    opacity: 0,
                    transform: 'translateY(40px) scale(0.9)',
                    willChange: 'transform, opacity',
                  }}
                >
                  <Card sx={{ p: 3, height: 400 }}>
                    <Typography variant="h6" gutterBottom>
                      <TimelineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Skill Distribution by Category
                    </Typography>
                    <Box sx={{ height: 300, mt: 2 }}>
                      <Radar data={prepareRadarData(analysis.gapsByCategory)} options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                              stepSize: 20,
                            },
                          },
                        },
                      }} />
                    </Box>
                  </Card>
                </div>
              </Grid>

              {/* Gap Breakdown by Category */}
              <Grid item xs={12} md={6}>
                <div 
                  ref={el => {
                    if (el && el.nodeType === 1) cardsRef.current[2] = el;
                  }}
                  style={{
                    opacity: 0,
                    transform: 'translateY(40px) scale(0.9)',
                    willChange: 'transform, opacity',
                  }}
                >
                  <Card sx={{ p: 3, height: 400, overflowY: 'auto' }}>
                    <Typography variant="h6" gutterBottom>
                      Gap Breakdown by Category
                    </Typography>
                    {Object.entries(analysis.gapsByCategory || {}).map(([category, data]) => (
                      <Box key={category} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {category} ({data.totalGaps} skills)
                        </Typography>
                        {data.gaps.slice(0, 3).map(gap => (
                          <Box key={gap.skillId} sx={{ mb: 1 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2">{gap.skillName}</Typography>
                              <Chip
                                label={gap.gapSeverity}
                                size="small"
                                sx={{
                                  bgcolor: getSeverityColor(gap.gapSeverity),
                                  color: 'white',
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={gap.gapPercentage}
                              sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
                              style={{
                                backgroundColor: getSeverityColor(gap.gapSeverity) + '20',
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </Card>
                </div>
              </Grid>

              {/* Summary Card */}
              <Grid item xs={12}>
                <div 
                  ref={el => {
                    if (el && el.nodeType === 1) cardsRef.current[3] = el;
                  }}
                  style={{
                    opacity: 0,
                    transform: 'translateY(40px) scale(0.9)',
                    willChange: 'transform, opacity',
                  }}
                >
                  <Card sx={{ p: 3, ...glassmorphism }}>
                    <Typography variant="h6" gutterBottom>
                      Analysis Summary
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" color="primary">
                            {analysis.totalGaps}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Gaps
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ color: '#f44336' }}>
                            {analysis.criticalGaps}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Critical
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ color: '#ff9800' }}>
                            {analysis.highGaps}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            High Priority
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ color: '#2196f3' }}>
                            {analysis.mediumGaps}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Medium
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Estimated Learning Time
                      </Typography>
                      <Typography variant="body1">
                        {analysis.summary.estimatedTime.timeline} ({analysis.summary.estimatedTime.totalHours} hours)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        size="large"
                        href="#recommendations"
                        sx={{ bgcolor: healthcareColors.primary }}
                        startIcon={<SchoolIcon />}
                      >
                        View Course Recommendations
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        href="#learning-path"
                        sx={{ borderColor: healthcareColors.primary, color: healthcareColors.primary }}
                      >
                        Generate Learning Path
                      </Button>
                      <Button
                        variant="text"
                        size="large"
                        onClick={handleAnalyze}
                      >
                        Re-analyze
                      </Button>
                    </Box>
                  </Card>
                </div>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </PageTransition>
  );
};

export default GapAnalysis;
