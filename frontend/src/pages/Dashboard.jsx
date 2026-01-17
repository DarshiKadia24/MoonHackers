import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Toolbar, Typography, Button, Alert } from '@mui/material';
import { Assessment as AssessmentIcon, School as SchoolIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { progressAPI, recommendationsAPI, userSkillsAPI, academicAPI, projectsAPI, learningActivitiesAPI } from '../services/api';
import { getUserId } from '../utils/userHelpers';
import HealthcareSidebar, { drawerWidth } from '../components/HealthcareSidebar';
import HealthcareTopBar from '../components/HealthcareTopBar';
import ClinicalReadinessCard from '../components/ClinicalReadinessCard';
import SkillVitalSignsCard from '../components/SkillVitalSignsCard';
import TreatmentPlanCard from '../components/TreatmentPlanCard';
import PatientCaseCard from '../components/PatientCaseCard';
import LabResultsCard from '../components/LabResultsCard';
import AcademicPerformanceCard from '../components/AcademicPerformanceCard';
import RecentProjectsCard from '../components/RecentProjectsCard';
import LearningActivityCard from '../components/LearningActivityCard';
import ECGAnimation from '../components/ECGAnimation';
import SkeletonLoader from '../components/SkeletonLoader';
import { healthcareColors } from '../theme';
import { fadeIn, stagger } from '../utils/animeHelper';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats] = useState({
    totalSkills: 0,
    coursesCompleted: 0,
    readinessScore: 0,
    gpa: 0,
    totalProjects: 0,
    learningHours: 0,
  });
  const [academicData, setAcademicData] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [hasData, setHasData] = useState(false);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const userId = getUserId(user);
    if (userId) {
      fetchDashboardData();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loading && containerRef.current) {
      setTimeout(() => {
        if (containerRef.current) {
          fadeIn(containerRef.current, { 
            duration: 1000,
            easing: 'easeOutExpo',
          });
        }
        
        const validCards = cardsRef.current.filter(card => card !== null && card !== undefined);
        if (validCards.length > 0) {
          stagger(validCards, { 
            staggerDelay: 120,
            duration: 800,
            easing: 'easeOutElastic(1, .8)',
          });
        }
      }, 100);
    }
  }, [loading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const userId = getUserId(user);
      if (!userId) {
        setLoading(false);
        return;
      }

      const progressResponse = await progressAPI.getUserProgress(userId);
      setProgressData(progressResponse.data);

      const recommendationsResponse = await recommendationsAPI.getUserRecommendations(userId);
      const recommendationsData = recommendationsResponse.data.recommendations || {};
      setRecommendations(recommendationsData);

      const userSkillsResponse = await userSkillsAPI.getAllUserSkills({ userId });
      const totalSkills = userSkillsResponse.data.count || 0;
      
      const readinessScore = progressResponse.data.progress?.averageScore || 0;

      // Fetch academic performance
      let coursesCompleted = 0;
      let gpa = 0;
      try {
        const academicResponse = await academicAPI.getAcademicPerformance(userId);
        setAcademicData(academicResponse.data);
        coursesCompleted = academicResponse.data?.courses?.length || 0;
        gpa = academicResponse.data?.cumulativeGPA || 0;
      } catch (error) {
        console.error('Error fetching academic data:', error);
      }

      // Fetch recent projects
      let totalProjects = 0;
      try {
        const projectsResponse = await projectsAPI.getUserProjects(userId, { limit: 3 });
        setRecentProjects(projectsResponse.data.projects || []);
        totalProjects = projectsResponse.data.count || 0;
      } catch (error) {
        console.error('Error fetching projects:', error);
      }

      // Fetch recent learning activities
      let learningHours = 0;
      try {
        const activitiesResponse = await learningActivitiesAPI.getUserLearningActivities(userId, { limit: 5 });
        setRecentActivities(activitiesResponse.data.activities || []);
        learningHours = Math.round(activitiesResponse.data.totalHours || 0);
      } catch (error) {
        console.error('Error fetching learning activities:', error);
      }

      setStats({
        totalSkills,
        coursesCompleted,
        readinessScore: Math.round(readinessScore),
        gpa,
        totalProjects,
        learningHours,
      });

      // Check if user has any data
      setHasData(totalSkills > 0 || coursesCompleted > 0 || totalProjects > 0 || recentActivities.length > 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setProgressData({
        progress: {
          overall: 0,
          skillsByCategory: {},
          skillsBySpecialty: {},
          averageScore: 0,
        },
      });
      setRecommendations([]);
      setStats({ totalSkills: 0, coursesCompleted: 0, readinessScore: 0, gpa: 0, totalProjects: 0, learningHours: 0 });
      setHasData(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const calculateVitals = () => {
    if (!progressData?.progress || stats.totalSkills === 0) {
      // Show encouraging defaults for new users
      return { clinical: 0, technical: 0, compliance: 0 };
    }

    const skillsByCategory = progressData.progress.skillsByCategory || {};
    const totalSkills = progressData.progress.totalSkills || 1;

    const clinical = skillsByCategory['Clinical'] || 0;
    const technical = skillsByCategory['Technical'] || 0;
    const regulatory = skillsByCategory['Regulatory'] || 0;

    return {
      clinical: Math.round((clinical / totalSkills) * 100),
      technical: Math.round((technical / totalSkills) * 100),
      compliance: Math.round((regulatory / totalSkills) * 100),
    };
  };

  const generateTreatmentPlan = () => {
    const treatments = [];
    
    const courses = recommendations?.courses || [];
    courses.slice(0, 3).forEach((course, index) => {
      treatments.push({
        id: `course-${index}`,
        title: course.title || 'Healthcare Course',
        description: course.description || 'Learn healthcare technology skills',
        type: 'Course',
        dosage: Math.floor(Math.random() * 5) + 2,
        progress: Math.floor(Math.random() * 50),
      });
    });

    const projects = recommendations?.careerPaths || [];
    projects.slice(0, 2).forEach((project, index) => {
      treatments.push({
        id: `project-${index}`,
        title: project.title || 'Healthcare Project',
        description: project.description || 'Build healthcare technology solution',
        type: 'Project',
        dosage: Math.floor(Math.random() * 8) + 5,
        progress: Math.floor(Math.random() * 30),
      });
    });

    // Default recommendations for new users
    if (treatments.length === 0) {
      treatments.push(
        {
          id: 'course-1',
          title: 'Introduction to Healthcare Informatics',
          description: 'Learn fundamentals of healthcare information systems',
          type: 'Course',
          dosage: 4,
          progress: 0,
        },
        {
          id: 'course-2',
          title: 'HIPAA Compliance Mastery',
          description: 'Master patient data protection regulations',
          type: 'Course',
          dosage: 3,
          progress: 0,
        }
      );
    }

    return treatments;
  };

  const getActiveProject = () => {
    if (recentProjects.length > 0) {
      const active = recentProjects.find(p => p.status === 'In Progress') || recentProjects[0];
      return {
        title: active.title,
        description: active.description || 'Working on healthcare technology project',
        progress: 45,
      };
    }
    return null;
  };

  const calculateAnalytics = () => {
    return {
      skillsMastery: stats.readinessScore || 0,
      courseCompletion: stats.coursesCompleted > 0 ? Math.round((stats.coursesCompleted / 10) * 100) : 0,
      assessmentAccuracy: stats.readinessScore > 0 ? Math.round(stats.readinessScore * 1.1) : 0,
      learningVelocity: stats.learningHours > 0 ? Math.min(100, Math.round(stats.learningHours * 2)) : 0,
    };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <HealthcareSidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: `calc(100% - ${drawerWidth}px)`,
            bgcolor: healthcareColors.background,
            minHeight: '100vh',
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <ECGAnimation width={400} height={150} color={healthcareColors.primary} />
              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <SkeletonLoader variant="rectangular" width={350} height={300} />
                <SkeletonLoader variant="rectangular" width={350} height={300} />
                <SkeletonLoader variant="rectangular" width={350} height={300} />
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    );
  }

  const vitals = calculateVitals();
  const treatments = generateTreatmentPlan();
  const activeProject = getActiveProject();
  const analytics = calculateAnalytics();

  return (
    <Box sx={{ display: 'flex', bgcolor: healthcareColors.background, minHeight: '100vh' }}>
      <HealthcareSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <HealthcareTopBar user={user} onLogout={handleLogout} />
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box 
            ref={containerRef} 
            sx={{ 
              opacity: 0,
              transform: 'translateY(30px)',
              willChange: 'transform, opacity',
            }}
          >
            {/* Welcome Message for New Users */}
            {!hasData && (
              <Alert 
                severity="info" 
                sx={{ mb: 3, borderRadius: 2 }}
                action={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      color="inherit" 
                      size="small" 
                      startIcon={<AssessmentIcon />}
                      onClick={() => navigate('/skills')}
                    >
                      Assess Skills
                    </Button>
                    <Button 
                      color="inherit" 
                      size="small" 
                      startIcon={<SchoolIcon />}
                      onClick={() => navigate('/profile')}
                    >
                      Add Data
                    </Button>
                  </Box>
                }
              >
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Welcome! Get started by assessing your skills and adding your academic records.
                </Typography>
                <Typography variant="body2">
                  Complete your profile to see personalized insights and recommendations.
                </Typography>
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Top Row - Key Metrics */}
              <Grid item xs={12} md={6}>
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
                  <ClinicalReadinessCard readinessScore={stats.readinessScore} />
                </div>
              </Grid>
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
                  <SkillVitalSignsCard vitals={vitals} />
                </div>
              </Grid>

              {/* Treatment Plan - Full Width */}
              <Grid item xs={12}>
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
                  <TreatmentPlanCard treatments={treatments} />
                </div>
              </Grid>

              {/* Second Row - Project & Analytics */}
              {activeProject && (
                <Grid item xs={12} md={6}>
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
                    <PatientCaseCard activeProject={activeProject} />
                  </div>
                </Grid>
              )}
              <Grid item xs={12} md={activeProject ? 6 : 12}>
                <div 
                  ref={el => {
                    if (el && el.nodeType === 1) cardsRef.current[4] = el;
                  }}
                  style={{
                    opacity: 0,
                    transform: 'translateY(40px) scale(0.9)',
                    willChange: 'transform, opacity',
                  }}
                >
                  <LabResultsCard analytics={analytics} />
                </div>
              </Grid>

              {/* Third Row - Academic, Projects, Activities */}
              <Grid item xs={12} md={4}>
                <div 
                  ref={el => {
                    if (el && el.nodeType === 1) cardsRef.current[5] = el;
                  }}
                  style={{
                    opacity: 0,
                    transform: 'translateY(40px) scale(0.9)',
                    willChange: 'transform, opacity',
                  }}
                >
                  <AcademicPerformanceCard 
                    academicData={academicData} 
                    coursesCompleted={stats.coursesCompleted}
                  />
                </div>
              </Grid>

              <Grid item xs={12} md={4}>
                <div 
                  ref={el => {
                    if (el && el.nodeType === 1) cardsRef.current[6] = el;
                  }}
                  style={{
                    opacity: 0,
                    transform: 'translateY(40px) scale(0.9)',
                    willChange: 'transform, opacity',
                  }}
                >
                  <RecentProjectsCard 
                    projects={recentProjects} 
                    totalProjects={stats.totalProjects}
                  />
                </div>
              </Grid>

              <Grid item xs={12} md={4}>
                <div 
                  ref={el => {
                    if (el && el.nodeType === 1) cardsRef.current[7] = el;
                  }}
                  style={{
                    opacity: 0,
                    transform: 'translateY(40px) scale(0.9)',
                    willChange: 'transform, opacity',
                  }}
                >
                  <LearningActivityCard 
                    activities={recentActivities} 
                    totalHours={stats.learningHours}
                  />
                </div>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
