import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  School as SchoolIcon,
  
  Code as CodeIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { usersAPI, academicAPI, projectsAPI, learningActivitiesAPI } from '../services/api';
import { formatDate } from '../utils';
import { getUserId } from '../utils/userHelpers';
import PageTransition from '../components/PageTransition';
import SkeletonLoader from '../components/SkeletonLoader';
import { healthcareColors } from '../theme';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [academicData, setAcademicData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [learningActivities, setLearningActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    projectType: 'Personal',
    healthcareDomain: '',
    status: 'In Progress',
  });
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    activityType: 'Course',
    source: '',
    status: 'Not Started',
    progress: 0,
  });

  const [formData, setFormData] = useState({
    healthcareCareerGoal: '',
    healthcareSpecialization: 'Health Informatics',
    healthcareCertifications: [],
    education: [],
    workExperience: [],
  });
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const userId = getUserId(user);
      if (!userId) return;

      // Fetch user profile data
      const education = user.education || [];
      const workExperience = user.workExperience || [];
      const certifications = user.healthcareCertifications || [];

      setFormData({
        healthcareCareerGoal: user.healthcareCareerGoal || '',
        healthcareSpecialization: user.healthcareSpecialization || 'Health Informatics',
        healthcareCertifications: certifications.length > 0 ? certifications : [{ name: '', issuer: '', date: '', expiry: '' }],
        education: education.length > 0 ? education : [{ institution: '', degree: '', year: '' }],
        workExperience: workExperience.length > 0 ? workExperience : [{ company: '', position: '', duration: '' }],
      });

      // Fetch academic performance
      try {
        const academicResponse = await academicAPI.getAcademicPerformance(userId);
        setAcademicData(academicResponse.data);
      } catch (error) {
        console.error('Error fetching academic data:', error);
        setAcademicData(null);
      }

      // Fetch projects
      try {
        const projectsResponse = await projectsAPI.getUserProjects(userId);
        setProjects(projectsResponse.data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      }

      // Fetch learning activities
      try {
        const activitiesResponse = await learningActivitiesAPI.getUserLearningActivities(userId, { limit: 20 });
        setLearningActivities(activitiesResponse.data.activities || []);
      } catch (error) {
        console.error('Error fetching learning activities:', error);
        setLearningActivities([]);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...formData.education];
    updated[index] = { ...updated[index], [field]: value };
    handleChange('education', updated);
  };

  const handleWorkExperienceChange = (index, field, value) => {
    const updated = [...formData.workExperience];
    updated[index] = { ...updated[index], [field]: value };
    handleChange('workExperience', updated);
  };

  const addEducationEntry = () => {
    handleChange('education', [...formData.education, { institution: '', degree: '', year: '' }]);
  };

  const removeEducationEntry = (index) => {
    const updated = formData.education.filter((_, i) => i !== index);
    handleChange('education', updated.length > 0 ? updated : [{ institution: '', degree: '', year: '' }]);
  };

  const addWorkExperienceEntry = () => {
    handleChange('workExperience', [...formData.workExperience, { company: '', position: '', duration: '' }]);
  };

  const removeWorkExperienceEntry = (index) => {
    const updated = formData.workExperience.filter((_, i) => i !== index);
    handleChange('workExperience', updated.length > 0 ? updated : [{ company: '', position: '', duration: '' }]);
  };

  const handleSave = async () => {
    try {
      const userId = getUserId(user);
      if (!userId) {
        alert('User ID not found. Please login again.');
        return;
      }

      const updateData = {
        healthcareCareerGoal: formData.healthcareCareerGoal,
        healthcareSpecialization: formData.healthcareSpecialization,
        healthcareCertifications: formData.healthcareCertifications.filter(cert => cert.name && cert.issuer && cert.date),
      };

      await usersAPI.updateUser(userId, updateData);
      updateUser({ ...user, ...updateData });
      setOriginalData({ ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
  };

  const handleAddProject = async () => {
    try {
      const userId = getUserId(user);
      if (!userId) return;

      const projectData = {
        ...newProject,
        userId,
      };

      await projectsAPI.createProject(projectData);
      setProjectDialogOpen(false);
      setNewProject({ title: '', description: '', projectType: 'Personal', healthcareDomain: '', status: 'In Progress' });
      fetchProfileData();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  const handleAddActivity = async () => {
    try {
      const userId = getUserId(user);
      if (!userId) return;

      const activityData = {
        ...newActivity,
        userId,
        dateStarted: new Date(),
      };

      await learningActivitiesAPI.createLearningActivity(activityData);
      setActivityDialogOpen(false);
      setNewActivity({ title: '', description: '', activityType: 'Course', source: '', status: 'Not Started', progress: 0 });
      fetchProfileData();
    } catch (error) {
      console.error('Error creating learning activity:', error);
      alert('Failed to create learning activity. Please try again.');
    }
  };

  // Grade point map for reference
  // const gradePointMap = {
  //   'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  //   'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  //   'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  //   'D+': 1.3, 'D': 1.0, 'F': 0.0,
  // };

  if (loading) {
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
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
          Profile
        </Typography>

        {/* User Info Section (Read-only) */}
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3, background: `linear-gradient(135deg, ${healthcareColors.primary}15 0%, ${healthcareColors.secondary}15 100%)` }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3, color: healthcareColors.primary }}>
              User Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {user?.firstName} {user?.lastName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {user?.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Joined Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Healthcare Specialization
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {formData.healthcareSpecialization || 'Not set'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Academic Performance Section */}
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: healthcareColors.primary }}>
                <SchoolIcon sx={{ mr: 1.5, verticalAlign: 'middle', fontSize: 28 }} />
                Academic Performance
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => {
                  // TODO: Open dialog to add course
                  alert('Feature coming soon! Use the API to add courses.');
                }}
                sx={{ borderColor: healthcareColors.primary, color: healthcareColors.primary }}
              >
                Add Course
              </Button>
            </Box>
            {academicData ? (
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {academicData.cumulativeGPA || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cumulative GPA
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.light', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                      {academicData.currentGPA || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current GPA
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                      {academicData.courses?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Courses Completed
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No academic data available. Add courses to track your academic performance.
              </Typography>
            )}
            {academicData?.courses && academicData.courses.length > 0 && (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Course</strong></TableCell>
                      <TableCell><strong>Grade</strong></TableCell>
                      <TableCell><strong>Credits</strong></TableCell>
                      <TableCell><strong>Semester</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {academicData.courses.slice(0, 5).map((course, index) => (
                      <TableRow key={index}>
                        <TableCell>{course.courseName || course.courseCode}</TableCell>
                        <TableCell>
                          <Chip
                            label={course.grade || 'N/A'}
                            size="small"
                            color={course.grade && ['A+', 'A', 'A-'].includes(course.grade) ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>{course.credits || 0}</TableCell>
                        <TableCell>{course.semester || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: healthcareColors.primary }}>
                <CodeIcon sx={{ mr: 1.5, verticalAlign: 'middle', fontSize: 28 }} />
                Projects ({projects.length})
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setProjectDialogOpen(true)}
                sx={{ bgcolor: healthcareColors.primary, '&:hover': { bgcolor: healthcareColors.dark } }}
              >
                Add Project
              </Button>
            </Box>
            {projects.length > 0 ? (
              <Grid container spacing={2}>
                {projects.slice(0, 3).map((project) => (
                  <Grid item xs={12} md={4} key={project._id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {project.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {project.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                          <Chip label={project.status} size="small" />
                          {project.healthcareDomain && (
                            <Chip label={project.healthcareDomain} size="small" color="primary" />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No projects yet. Add your first project to showcase your work!
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Learning Activities Section */}
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: healthcareColors.primary }}>
                <TrendingUpIcon sx={{ mr: 1.5, verticalAlign: 'middle', fontSize: 28 }} />
                Learning Activities ({learningActivities.length})
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setActivityDialogOpen(true)}
                sx={{ bgcolor: healthcareColors.primary, '&:hover': { bgcolor: healthcareColors.dark } }}
              >
                Add Activity
              </Button>
            </Box>
            {learningActivities.length > 0 ? (
              <Box>
                {learningActivities.slice(0, 5).map((activity) => (
                  <Box key={activity._id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {activity.title}
                      </Typography>
                      <Chip label={activity.status} size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {activity.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip label={activity.activityType} size="small" variant="outlined" />
                      {activity.source && <Chip label={activity.source} size="small" variant="outlined" />}
                      <Box sx={{ flexGrow: 1, ml: 2 }}>
                        <LinearProgress variant="determinate" value={activity.progress || 0} />
                        <Typography variant="caption" color="text.secondary">
                          {activity.progress || 0}% Complete
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No learning activities yet. Start tracking your learning journey!
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Editable Sections */}
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: healthcareColors.primary }}>
                Edit Profile
              </Typography>
              {!isEditing ? (
                <Button variant="contained" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>

            {/* Healthcare Career Goal */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Healthcare Career Goal
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Healthcare Career Goal"
                  value={formData.healthcareCareerGoal}
                  onChange={(e) => handleChange('healthcareCareerGoal', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Describe your healthcare technology career aspirations and goals..."
                />
              </AccordionDetails>
            </Accordion>

            {/* Healthcare Specialization */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Healthcare Specialization
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  select
                  label="Healthcare Specialization"
                  value={formData.healthcareSpecialization}
                  onChange={(e) => handleChange('healthcareSpecialization', e.target.value)}
                  disabled={!isEditing}
                >
                  <MenuItem value="Health Informatics">Health Informatics</MenuItem>
                  <MenuItem value="Medical Devices">Medical Devices</MenuItem>
                  <MenuItem value="Telemedicine">Telemedicine</MenuItem>
                  <MenuItem value="Clinical Data">Clinical Data</MenuItem>
                  <MenuItem value="Healthcare Cybersecurity">Healthcare Cybersecurity</MenuItem>
                </TextField>
              </AccordionDetails>
            </Accordion>

            {/* Healthcare Certifications */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Healthcare Certifications
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {formData.healthcareCertifications?.map((cert, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Certification Name"
                          value={cert.name}
                          onChange={(e) => {
                            const updated = [...formData.healthcareCertifications];
                            updated[index] = { ...updated[index], name: e.target.value };
                            handleChange('healthcareCertifications', updated);
                          }}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Issuer"
                          value={cert.issuer}
                          onChange={(e) => {
                            const updated = [...formData.healthcareCertifications];
                            updated[index] = { ...updated[index], issuer: e.target.value };
                            handleChange('healthcareCertifications', updated);
                          }}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Date"
                          type="date"
                          value={cert.date}
                          onChange={(e) => {
                            const updated = [...formData.healthcareCertifications];
                            updated[index] = { ...updated[index], date: e.target.value };
                            handleChange('healthcareCertifications', updated);
                          }}
                          disabled={!isEditing}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Expiry Date (Optional)"
                          type="date"
                          value={cert.expiry || ''}
                          onChange={(e) => {
                            const updated = [...formData.healthcareCertifications];
                            updated[index] = { ...updated[index], expiry: e.target.value };
                            handleChange('healthcareCertifications', updated);
                          }}
                          disabled={!isEditing}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      {isEditing && (
                        <Grid item xs={12}>
                          <IconButton
                            color="error"
                            onClick={() => {
                              const updated = formData.healthcareCertifications.filter((_, i) => i !== index);
                              handleChange('healthcareCertifications', updated.length > 0 ? updated : [{ name: '', issuer: '', date: '', expiry: '' }]);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                ))}
                {isEditing && (
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => {
                      handleChange('healthcareCertifications', [...formData.healthcareCertifications, { name: '', issuer: '', date: '', expiry: '' }]);
                    }}
                  >
                    Add Certification
                  </Button>
                )}
              </AccordionDetails>
            </Accordion>

            {/* Education History */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Education History
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {formData.education?.map((edu, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Institution"
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Degree"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Year"
                          value={edu.year}
                          onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        {isEditing && formData.education.length > 1 && (
                          <IconButton
                            color="error"
                            onClick={() => removeEducationEntry(index)}
                            sx={{ mt: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                {isEditing && (
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addEducationEntry}
                    variant="outlined"
                    sx={{ mt: 1 }}
                  >
                    Add Education
                  </Button>
                )}
              </AccordionDetails>
            </Accordion>

            {/* Work Experience */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Work Experience
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {formData.workExperience?.map((work, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Company"
                          value={work.company}
                          onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Position"
                          value={work.position}
                          onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Duration"
                          value={work.duration}
                          onChange={(e) => handleWorkExperienceChange(index, 'duration', e.target.value)}
                          disabled={!isEditing}
                          placeholder="e.g., 2020-2022"
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        {isEditing && formData.workExperience.length > 1 && (
                          <IconButton
                            color="error"
                            onClick={() => removeWorkExperienceEntry(index)}
                            sx={{ mt: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                {isEditing && (
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addWorkExperienceEntry}
                    variant="outlined"
                    sx={{ mt: 1 }}
                  >
                    Add Work Experience
                  </Button>
                )}
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>

        {/* Add Project Dialog */}
        <Dialog 
          open={projectDialogOpen} 
          onClose={() => setProjectDialogOpen(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: healthcareColors.primary }}>
            Add New Project
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Project Title"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              sx={{ mb: 2, mt: 1 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Project Type"
              value={newProject.projectType}
              onChange={(e) => setNewProject({ ...newProject, projectType: e.target.value })}
              sx={{ mb: 2 }}
            >
              <MenuItem value="Academic">Academic</MenuItem>
              <MenuItem value="Personal">Personal</MenuItem>
              <MenuItem value="Professional">Professional</MenuItem>
              <MenuItem value="Open Source">Open Source</MenuItem>
              <MenuItem value="Research">Research</MenuItem>
              <MenuItem value="Hackathon">Hackathon</MenuItem>
            </TextField>
            <TextField
              fullWidth
              select
              label="Healthcare Domain"
              value={newProject.healthcareDomain}
              onChange={(e) => setNewProject({ ...newProject, healthcareDomain: e.target.value })}
            >
              <MenuItem value="Health Informatics">Health Informatics</MenuItem>
              <MenuItem value="Medical Devices">Medical Devices</MenuItem>
              <MenuItem value="Telemedicine">Telemedicine</MenuItem>
              <MenuItem value="Clinical Data">Clinical Data</MenuItem>
              <MenuItem value="Healthcare Cybersecurity">Healthcare Cybersecurity</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setProjectDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleAddProject}
              sx={{ bgcolor: healthcareColors.primary, '&:hover': { bgcolor: healthcareColors.dark } }}
            >
              Add Project
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Learning Activity Dialog */}
        <Dialog 
          open={activityDialogOpen} 
          onClose={() => setActivityDialogOpen(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: healthcareColors.primary }}>
            Add Learning Activity
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Activity Title"
              value={newActivity.title}
              onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
              sx={{ mb: 2, mt: 1 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={newActivity.description}
              onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Activity Type"
              value={newActivity.activityType}
              onChange={(e) => setNewActivity({ ...newActivity, activityType: e.target.value })}
              sx={{ mb: 2 }}
            >
              <MenuItem value="Course">Course</MenuItem>
              <MenuItem value="Tutorial">Tutorial</MenuItem>
              <MenuItem value="Workshop">Workshop</MenuItem>
              <MenuItem value="Conference">Conference</MenuItem>
              <MenuItem value="Reading">Reading</MenuItem>
              <MenuItem value="Practice">Practice</MenuItem>
              <MenuItem value="Project">Project</MenuItem>
              <MenuItem value="Certification">Certification</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Source/Platform"
              value={newActivity.source}
              onChange={(e) => setNewActivity({ ...newActivity, source: e.target.value })}
              placeholder="e.g., Coursera, edX, YouTube"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setActivityDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleAddActivity}
              sx={{ bgcolor: healthcareColors.primary, '&:hover': { bgcolor: healthcareColors.dark } }}
            >
              Add Activity
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </PageTransition>
  );
};

export default Profile;
