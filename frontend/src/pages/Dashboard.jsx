import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Toolbar, 
  Typography, 
  Button, 
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { 
  Assessment as AssessmentIcon, 
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  AccountTree as ProjectIcon,
  Schedule as TimeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { progressAPI, recommendationsAPI, userSkillsAPI, academicAPI, projectsAPI, learningActivitiesAPI } from '../services/api';
import { getUserId } from '../utils/userHelpers';
import PremiumSidebar, { drawerWidth } from '../components/PremiumSidebar';
import PremiumTopBar from '../components/PremiumTopBar';
import PremiumStatCard from '../components/PremiumStatCard';
import PremiumProgressCard from '../components/PremiumProgressCard';
import PremiumLoader from '../components/PremiumLoader';
import AcademicPerformanceCard from '../components/AcademicPerformanceCard';
import RecentProjectsCard from '../components/RecentProjectsCard';
import LearningActivityCard from '../components/LearningActivityCard';
import { healthcareColors } from '../theme';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  useEffect(() => {
    const userId = getUserId(user);
    if (userId) {
      fetchDashboardData();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <PremiumSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            bgcolor: '#F8F9FA',
            minHeight: '100vh',
          }}
        >
          <PremiumTopBar onMenuClick={() => setSidebarOpen(true)} />
          <Toolbar />
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <PremiumLoader message="Loading your dashboard..." />
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      <PremiumSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <PremiumTopBar onMenuClick={() => setSidebarOpen(true)} />
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} lg={3}>
                <PremiumStatCard
                  title="Total Skills"
                  value={stats.totalSkills}
                  subtitle="Skills tracked"
                  icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
                  color="#1E3A5F"
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <PremiumStatCard
                  title="Readiness Score"
                  value={`${stats.readinessScore}%`}
                  subtitle="Overall proficiency"
                  icon={<TrophyIcon sx={{ fontSize: 28 }} />}
                  color="#6366F1"
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <PremiumStatCard
                  title="Projects"
                  value={stats.totalProjects}
                  subtitle="Completed projects"
                  icon={<ProjectIcon sx={{ fontSize: 28 }} />}
                  color="#D4AF37"
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <PremiumStatCard
                  title="Learning Hours"
                  value={stats.learningHours}
                  subtitle="Total hours invested"
                  icon={<TimeIcon sx={{ fontSize: 28 }} />}
                  color="#10B981"
                />
              </Grid>
            </Grid>

            {/* Progress Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <PremiumProgressCard
                  title="Skill Readiness"
                  progress={stats.readinessScore}
                  description="Your overall skill proficiency level"
                  color="#1E3A5F"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <PremiumProgressCard
                  title="Course Completion"
                  progress={Math.min(100, (stats.coursesCompleted / 10) * 100)}
                  description={`${stats.coursesCompleted} courses completed`}
                  color="#6366F1"
                />
              </Grid>
            </Grid>

            {/* Content Grid */}
            <Grid container spacing={3}>
              {/* Academic Performance */}
              {academicData && (
                <Grid item xs={12} lg={4}>
                  <AcademicPerformanceCard academicData={academicData} />
                </Grid>
              )}

              {/* Recent Projects */}
              {recentProjects.length > 0 && (
                <Grid item xs={12} lg={4}>
                  <RecentProjectsCard projects={recentProjects} />
                </Grid>
              )}

              {/* Recent Learning Activities */}
              {recentActivities.length > 0 && (
                <Grid item xs={12} lg={4}>
                  <LearningActivityCard activities={recentActivities} />
                </Grid>
              )}

              {/* Recommendations Card */}
              {recommendations && Object.keys(recommendations).length > 0 && (
                <Grid item xs={12}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: '1px solid rgba(30, 58, 95, 0.08)',
                      boxShadow: '0 2px 8px rgba(30, 58, 95, 0.04)',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Recommended Next Steps
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                          variant="contained"
                          startIcon={<AssessmentIcon />}
                          onClick={() => navigate('/gap-analysis')}
                          sx={{ borderRadius: 2 }}
                        >
                          View Gap Analysis
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<SchoolIcon />}
                          onClick={() => navigate('/course-recommendations')}
                          sx={{ borderRadius: 2 }}
                        >
                          Explore Courses
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<TrendingUpIcon />}
                          onClick={() => navigate('/career-paths')}
                          sx={{ borderRadius: 2 }}
                        >
                          Career Paths
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
