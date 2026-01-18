import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  School as CourseIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { recommendationsAPI } from '../services/api';
import { getSpecialtyColor, getSpecialtyBgColor } from '../theme';
import { getUserId } from '../utils/userHelpers';

const Recommendations = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState({
    newSkills: [],
    skillsToImprove: [],
    courses: [],
    careerPaths: [],
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const userId = getUserId(user);
    if (userId) {
      fetchRecommendations();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = getUserId(user);
      if (!userId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }

      const response = await recommendationsAPI.getUserRecommendations(userId);
      const data = response.data;

      setRecommendations({
        newSkills: data.recommendations?.newSkills || [],
        skillsToImprove: data.recommendations?.skillsToImprove || [],
        courses: data.recommendations?.courses || [],
        careerPaths: data.recommendations?.careerPaths || [],
      });

      setStats(data.stats || {});
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading recommendations...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Recommendations
        </Typography>
        <Button variant="outlined" onClick={fetchRecommendations}>
          Refresh
        </Button>
      </Box>

      {stats && (
        <Box sx={{ mb: 4, p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your Recommendation Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2">New Skills</Typography>
              <Typography variant="h5">{stats.newSkillsCount || 0}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2">Skills to Improve</Typography>
              <Typography variant="h5">{stats.skillsToImproveCount || 0}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2">Recommended Courses</Typography>
              <Typography variant="h5">{stats.coursesCount || 0}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2">Career Paths</Typography>
              <Typography variant="h5">{stats.careerPathsCount || 0}</Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* New Skills Section */}
      {recommendations.newSkills.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            New Skills to Learn
          </Typography>
          <Grid container spacing={2}>
            {recommendations.newSkills.slice(0, 6).map((skill, index) => (
              <Grid item xs={12} sm={6} md={4} key={skill._id || index}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {skill.name}
                      </Typography>
                      <Chip
                        label={skill.category}
                        size="small"
                        color="primary"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {skill.description}
                    </Typography>
                    <Button size="small" variant="outlined" fullWidth>
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Skills to Improve Section */}
      {recommendations.skillsToImprove.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Skills to Improve
          </Typography>
          <Grid container spacing={2}>
            {recommendations.skillsToImprove.slice(0, 6).map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {item.skill?.name || 'Skill'}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Current Level: {item.currentLevel}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Current Score: {item.currentScore}/100
                      </Typography>
                    </Box>
                    <Button size="small" variant="contained" fullWidth>
                      Improve Skill
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Recommended Courses */}
      {recommendations.courses.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Recommended Courses
          </Typography>
          <Grid container spacing={2}>
            {recommendations.courses.map((course, index) => (
              <Grid item xs={12} md={6} key={course._id || index}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
                      <CourseIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {course.title}
                          </Typography>
                          <Chip
                            label={course.type || 'Course'}
                            size="small"
                            color="primary"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {course.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                          {course.provider && (
                            <Chip label={course.provider} size="small" variant="outlined" />
                          )}
                          {course.difficulty && (
                            <Chip label={course.difficulty} size="small" variant="outlined" />
                          )}
                          {course.duration && (
                            <Chip label={course.duration} size="small" variant="outlined" />
                          )}
                        </Box>
                        <Button
                          variant="contained"
                          size="small"
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Enroll Now
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Recommended Career Paths */}
      {recommendations.careerPaths.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Recommended Career Paths
          </Typography>
          <Grid container spacing={2}>
            {recommendations.careerPaths.map((path, index) => (
              <Grid item xs={12} md={6} key={path._id || index}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {path.title}
                      </Typography>
                      <Chip
                        label={path.healthcareSpecialty || 'General'}
                        size="small"
                        sx={{
                          bgcolor: getSpecialtyBgColor(path.healthcareSpecialty),
                          color: getSpecialtyColor(path.healthcareSpecialty),
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {path.description}
                    </Typography>
                    {path.salaryRange && (
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Salary: ${path.salaryRange.min?.toLocaleString() || 'N/A'} - ${path.salaryRange.max?.toLocaleString() || 'N/A'}
                      </Typography>
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => window.location.href = '/career-paths'}
                    >
                      Explore Career Path
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {recommendations.newSkills.length === 0 &&
        recommendations.skillsToImprove.length === 0 &&
        recommendations.courses.length === 0 &&
        recommendations.careerPaths.length === 0 && (
          <Alert severity="info">
            No recommendations available at this time. Complete your skills assessment to get personalized recommendations.
          </Alert>
        )}
    </Container>
  );
};

export default Recommendations;
