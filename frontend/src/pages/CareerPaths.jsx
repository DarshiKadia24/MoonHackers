import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { careerPathsAPI, userSkillsAPI } from '../services/api';
import { getUserId } from '../utils/userHelpers';
import HospitalFloorPlan from '../components/HospitalFloorPlan';
import CareerFlipCard from '../components/CareerFlipCard';
import MedicalTrainingTimeline from '../components/MedicalTrainingTimeline';
import SurgicalPrecisionSkills from '../components/SurgicalPrecisionSkills';
import PageTransition from '../components/PageTransition';
import SkeletonLoader from '../components/SkeletonLoader';
import { healthcareColors } from '../theme';

const departmentMapping = {
  emergency: { min: 0, max: 60000 },
  ward: { min: 60000, max: 90000 },
  surgery: { min: 90000, max: 130000 },
  leadership: { min: 130000, max: Infinity },
};

const CareerPaths = () => {
  const { user } = useAuth();
  const [careerPaths, setCareerPaths] = useState([]);
  const [filteredPaths, setFilteredPaths] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedPath, setExpandedPath] = useState(null);

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

  const handleDepartmentClick = (department) => {
    if (selectedDepartment === department) {
      setSelectedDepartment(null);
      setFilteredPaths(careerPaths);
    } else {
      setSelectedDepartment(department);
      const range = departmentMapping[department];
      const filtered = careerPaths.filter((path) => {
        const salary = path.salaryRange?.min || 0;
        return salary >= range.min && salary < range.max;
      });
      setFilteredPaths(filtered);
    }
  };

  const handleExploreCareer = (career) => {
    setSelectedCareer(career);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCareer(null);
  };

  const handlePathExpand = (pathId) => {
    setExpandedPath(expandedPath === pathId ? null : pathId);
  };

  if (loading && careerPaths.length === 0) {
    return (
      <PageTransition>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
              Loading hospital floor plan...
            </Typography>
            <Box sx={{ mt: 4 }}>
              <SkeletonLoader variant="rectangular" width="100%" height={200} count={3} />
            </Box>
          </Box>
        </Container>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <HospitalIcon sx={{ fontSize: 48, color: healthcareColors.primary, mr: 2 }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
                Medical Career Progression Map
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Explore healthcare technology careers organized by hospital departments
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Hospital Floor Plan */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Hospital Floor Plan
            </Typography>
            <HospitalFloorPlan
              careerPaths={careerPaths}
              onDepartmentClick={handleDepartmentClick}
              selectedDepartment={selectedDepartment}
            />
            {selectedDepartment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ mt: 3 }}
              >
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  Showing {filteredPaths.length} career path{filteredPaths.length !== 1 ? 's' : ''} in{' '}
                  {selectedDepartment === 'emergency'
                    ? 'Emergency Room'
                    : selectedDepartment === 'ward'
                    ? 'Specialized Wards'
                    : selectedDepartment === 'surgery'
                    ? 'Surgical Suites'
                    : 'Leadership Floor'}
                </Alert>
              </motion.div>
            )}
          </Box>
        </motion.div>

        {/* Career Paths Grid */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {selectedDepartment ? 'Department Careers' : 'All Career Paths'}
            </Typography>
            <Chip
              label={`${filteredPaths.length} Path${filteredPaths.length !== 1 ? 's' : ''}`}
              sx={{
                bgcolor: healthcareColors.primary,
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Box>

          {filteredPaths.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No career paths found in this department
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSelectedDepartment(null);
                  setFilteredPaths(careerPaths);
                }}
              >
                View All Career Paths
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              <AnimatePresence>
                {filteredPaths.map((career, index) => (
                  <Grid item xs={12} md={6} lg={4} key={career._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -8 }}
                      style={{ height: '100%' }}
                    >
                      <CareerFlipCard
                        careerPath={career}
                        userSkills={userSkills}
                        onExplore={handleExploreCareer}
                      />
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </Box>

        {/* Expandable Career Path Details */}
        {selectedCareer && (
          <Box sx={{ mb: 4 }}>
            <Accordion
              expanded={expandedPath === selectedCareer._id}
              onChange={() => handlePathExpand(selectedCareer._id)}
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  bgcolor: `${healthcareColors.primary}10`,
                  borderRadius: expandedPath === selectedCareer._id ? '12px 12px 0 0' : '12px',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <HospitalIcon sx={{ mr: 2, color: healthcareColors.primary }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {selectedCareer.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Click to expand detailed progression timeline
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <MedicalTrainingTimeline careerPath={selectedCareer} currentStage={2} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <SurgicalPrecisionSkills
                      requiredSkills={selectedCareer.requiredSkills || []}
                      userSkills={userSkills}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}

        {/* Career Details Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(227, 242, 253, 0.95) 0%, rgba(187, 222, 251, 0.95) 100%)',
            },
          }}
        >
          {selectedCareer && (
            <>
              <DialogTitle
                sx={{
                  bgcolor: healthcareColors.primary,
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {selectedCareer.title}
                  </Typography>
                  <Chip
                    label={selectedCareer.healthcareSpecialty || 'General'}
                    sx={{
                      bgcolor: 'white',
                      color: healthcareColors.primary,
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                  {selectedCareer.description}
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <MedicalTrainingTimeline careerPath={selectedCareer} currentStage={2} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <SurgicalPrecisionSkills
                      requiredSkills={selectedCareer.requiredSkills || []}
                      userSkills={userSkills}
                    />
                  </Grid>
                </Grid>

                {selectedCareer.salaryRange && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Salary Range
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: healthcareColors.secondary }}>
                      ${selectedCareer.salaryRange.min?.toLocaleString()} - $
                      {selectedCareer.salaryRange.max?.toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button onClick={handleCloseDialog} variant="outlined">
                  Close
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    alert('Career path set as goal!');
                    handleCloseDialog();
                  }}
                  sx={{
                    bgcolor: healthcareColors.primary,
                    '&:hover': { bgcolor: healthcareColors.primary },
                  }}
                >
                  Set as Career Goal
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </PageTransition>
  );
};

export default CareerPaths;
