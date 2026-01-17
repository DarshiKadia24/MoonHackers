import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Chip } from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import { glassmorphism, healthcareColors } from '../theme';

const AcademicPerformanceCard = ({ academicData, coursesCompleted }) => {
  const gpa = academicData?.cumulativeGPA || 0;
  // const currentGpa = academicData?.currentGPA || gpa;
  const courses = academicData?.courses || [];
  const recentCourses = courses.slice(0, 3);

  return (
    <Card sx={{ height: '100%', ...glassmorphism, borderRadius: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SchoolIcon sx={{ fontSize: 32, color: healthcareColors.primary, mr: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: healthcareColors.primary }}>
            Academic Performance
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(13, 71, 161, 0.1)', borderRadius: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: healthcareColors.primary }}>
                {gpa > 0 ? gpa.toFixed(2) : 'N/A'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Cumulative GPA
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(0, 137, 123, 0.1)', borderRadius: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: healthcareColors.secondary }}>
                {coursesCompleted}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Courses
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {recentCourses.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Recent Courses
            </Typography>
            {recentCourses.map((course, index) => (
              <Box key={index} sx={{ mb: 1, p: 1.5, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {course.courseName || course.courseCode}
                  </Typography>
                  {course.grade && (
                    <Chip
                      label={course.grade}
                      size="small"
                      sx={{
                        bgcolor: ['A+', 'A', 'A-'].includes(course.grade) ? '#4caf50' : '#ff9800',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
                {course.semester && (
                  <Typography variant="caption" color="text.secondary">
                    {course.semester}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {courses.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No academic records yet. Add courses in your profile!
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AcademicPerformanceCard;
