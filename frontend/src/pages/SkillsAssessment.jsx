import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  
  CardContent,
  TextField,
  Button,
  Grid,
  Chip,
  Alert,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  MedicalServices as MedicalIcon,
  
  Favorite as HeartIcon,
  Psychology as BrainIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { skillsAPI, progressAPI, recommendationsAPI } from '../services/api';
import { getUserId } from '../utils/userHelpers';
import GlassCard from '../components/GlassCard';
import MedicalProficiencySelector from '../components/MedicalProficiencySelector';
import MedicalEvidenceUpload from '../components/MedicalEvidenceUpload';
import DiagnosisReport from '../components/DiagnosisReport';
import HospitalMonitorProgress from '../components/HospitalMonitorProgress';
import StethoscopeAnimation from '../components/StethoscopeAnimation';
import ECGAnimation from '../components/ECGAnimation';
import PageTransition from '../components/PageTransition';
import ConfettiCelebration from '../components/ConfettiCelebration';
import SkeletonLoader from '../components/SkeletonLoader';
import SkillTooltip from '../components/SkillTooltip';
import { healthcareColors } from '../theme';

// Medical system mapping
const systemMapping = {
  Clinical: { name: 'Cardiovascular System', icon: <HeartIcon />, color: healthcareColors.accent },
  Technical: { name: 'Neurological System', icon: <BrainIcon />, color: healthcareColors.primary },
  Regulatory: { name: 'Immune System', icon: <SecurityIcon />, color: '#f57c00' },
  Analytical: { name: 'Respiratory System', icon: <AnalyticsIcon />, color: healthcareColors.secondary },
  'Soft Skills': { name: 'Endocrine System', icon: <PeopleIcon />, color: '#9c27b0' },
};

const SkillsAssessment = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [assessments, setAssessments] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [, setSummary] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStethoscope, setShowStethoscope] = useState(false);
  const [diagnosisReport, setDiagnosisReport] = useState(null);
  const [ecgDrawn, setEcgDrawn] = useState(false);

  const categories = [
    { label: 'Clinical Skills', value: 'Clinical' },
    { label: 'Technical Skills', value: 'Technical' },
    { label: 'Regulatory', value: 'Regulatory' },
    { label: 'Analytical', value: 'Analytical' },
    { label: 'Soft Skills', value: 'Soft Skills' },
  ];

  useEffect(() => {
    fetchSkills();
    // Trigger ECG animation on load
    setTimeout(() => setEcgDrawn(true), 500);
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await skillsAPI.getAllSkills();
      setSkills(response.data.skills || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProficiencyChange = (skillId, level) => {
    setAssessments({
      ...assessments,
      [skillId]: {
        ...assessments[skillId],
        rating: level,
      },
    });
  };

  const handleEvidenceUpload = (skillId, files) => {
    setAssessments({
      ...assessments,
      [skillId]: {
        ...assessments[skillId],
        evidenceFiles: files,
      },
    });
  };

  const handleGoalChange = (skillId, value) => {
    setAssessments({
      ...assessments,
      [skillId]: {
        ...assessments[skillId],
        goal: value,
      },
    });
  };

  const getSkillsByCategory = (category) => {
    return skills.filter((skill) => skill.category === category);
  };

  const calculateSkillGaps = () => {
    const gaps = [];
    const assessedSkills = Object.keys(assessments).filter(
      (skillId) => assessments[skillId]?.rating
    );

    // Compare assessed skills with recommended skills
    assessedSkills.forEach((skillId) => {
      const assessment = assessments[skillId];
      const skill = skills.find((s) => s._id === skillId);
      if (skill && assessment.rating < 3) {
        gaps.push({
          skillName: skill.name,
          currentLevel: getProficiencyName(assessment.rating),
          requiredLevel: 'Resident',
        });
      }
    });

    return gaps;
  };

  const getProficiencyName = (level) => {
    const levels = {
      1: 'Novice',
      2: 'Intern',
      3: 'Resident',
      4: 'Specialist',
      5: 'Chief of Staff',
    };
    return levels[level] || 'Not assessed';
  };

  const handleSaveAssessment = async () => {
    try {
      setLoading(true);
      const userId = getUserId(user);
      if (!userId) {
        alert('User ID not found. Please login again.');
        setLoading(false);
        return;
      }

      const updates = [];

      for (const [skillId, assessment] of Object.entries(assessments)) {
        if (assessment.rating) {
          const proficiencyLevels = ['beginner', 'intermediate', 'advanced', 'expert', 'master'];
          const level = proficiencyLevels[assessment.rating - 1] || 'beginner';
          const score = (assessment.rating / 5) * 100;

          const updateData = {
            userId,
            skillId,
            proficiency: {
              level,
              score,
            },
            evidence: assessment.evidenceFiles || [],
            goal: assessment.goal ? { targetLevel: assessment.goal } : {},
          };

          updates.push(progressAPI.updateProgress(updateData));
        }
      }

      await Promise.all(updates);

      const totalSkills = skills.length;
      const assessedSkills = Object.keys(assessments).filter(
        (skillId) => assessments[skillId]?.rating
      ).length;
      const averageRating =
        Object.values(assessments)
          .filter((a) => a.rating)
          .reduce((sum, a) => sum + (a.rating || 0), 0) / assessedSkills;
      const completionRate = ((assessedSkills / totalSkills) * 100).toFixed(1);

      setSummary({
        totalSkills,
        assessedSkills,
        averageRating: averageRating.toFixed(1),
        completionRate,
      });

      // Generate diagnosis report
      const skillGaps = calculateSkillGaps();
      let recommendations = [];
      
      try {
        const recResponse = await recommendationsAPI.getUserRecommendations(userId);
        recommendations = [
          ...(recResponse.data.recommendations?.courses?.slice(0, 3) || []).map((c) => ({
            ...c,
            type: 'Course',
          })),
          ...(recResponse.data.recommendations?.careerPaths?.slice(0, 2) || []).map((cp) => ({
            ...cp,
            type: 'Project',
          })),
        ];
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }

      setDiagnosisReport({
        skillGaps,
        recommendations,
      });

      // Show completion animation
      setShowStethoscope(true);
      setTimeout(() => setShowStethoscope(false), 3000);

      // Check for milestones
      if (assessedSkills >= 10) {
        setShowConfetti(true);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 5000);
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('Failed to save assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getOverallProgress = () => {
    const assessedSkills = Object.keys(assessments).filter(
      (skillId) => assessments[skillId]?.rating
    ).length;
    const totalSkills = skills.length;
    return totalSkills > 0 ? (assessedSkills / totalSkills) * 100 : 0;
  };

  if (loading && skills.length === 0) {
    return (
      <PageTransition>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ECGAnimation width={400} height={150} color={healthcareColors.primary} />
            <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
              Loading clinical assessment...
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
        <ConfettiCelebration trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

        {/* ECG Header Animation */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: ecgDrawn ? 1 : 0, scaleX: ecgDrawn ? 1 : 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{ mb: 3 }}
        >
          <Box
            sx={{
              height: 80,
              bgcolor: 'rgba(13, 71, 161, 0.05)',
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <ECGAnimation width={1200} height={80} color={healthcareColors.primary} />
          </Box>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <HospitalIcon sx={{ fontSize: 48, color: healthcareColors.primary, mr: 2 }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
                Clinical Skill Assessment
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Comprehensive evaluation of healthcare technology competencies
              </Typography>
            </Box>
          </Box>

          {/* Overall Progress Monitor */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Assessment Progress
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: healthcareColors.primary }}>
                {Math.round(getOverallProgress())}%
              </Typography>
            </Box>
            <HospitalMonitorProgress value={getOverallProgress()} height={12} />
          </Box>
        </motion.div>

        {/* Stethoscope Completion Animation */}
        <AnimatePresence>
          {showStethoscope && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <GlassCard sx={{ mb: 4 }}>
                <StethoscopeAnimation message="Assessment Complete" />
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Alert */}
        <AnimatePresence>
          {saved && !showStethoscope && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                Clinical assessment saved successfully! Diagnosis report generated.
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Diagnosis Report */}
        {diagnosisReport && (
          <Box sx={{ mb: 4 }}>
            <DiagnosisReport
              skillGaps={diagnosisReport.skillGaps}
              recommendations={diagnosisReport.recommendations}
            />
          </Box>
        )}

        {/* System Checks (Skill Categories) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {categories.map((category, catIndex) => {
            const categorySkills = getSkillsByCategory(category.value);
            if (categorySkills.length === 0) return null;

            const system = systemMapping[category.value];

            return (
              <Box key={category.value} sx={{ mb: 5 }}>
                {/* System Header */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: catIndex * 0.1 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 3,
                      p: 2,
                      bgcolor: `${system.color}15`,
                      borderRadius: 3,
                      border: `2px solid ${system.color}40`,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: system.color,
                        color: 'white',
                        mr: 2,
                      }}
                    >
                      {system.icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {system.name} Check
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.label} • {categorySkills.length} skills to assess
                      </Typography>
                    </Box>
                    <Chip
                      label={`${categorySkills.length} Skills`}
                      sx={{ bgcolor: system.color, color: 'white', fontWeight: 600 }}
                    />
                  </Box>
                </motion.div>

                {/* Skills Grid */}
                <Grid container spacing={3}>
                  {categorySkills.map((skill, index) => (
                    <Grid item xs={12} md={6} key={skill._id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (catIndex * 0.1) + (index * 0.05) }}
                        whileHover={{ y: -4 }}
                      >
                        <SkillTooltip skill={skill}>
                          <GlassCard
                            sx={{
                              height: '100%',
                              border: `2px solid ${system.color}30`,
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                                    {skill.name}
                                  </Typography>
                                  <Chip
                                    label={category.label}
                                    size="small"
                                    sx={{
                                      bgcolor: `${system.color}20`,
                                      color: system.color,
                                      fontWeight: 600,
                                    }}
                                  />
                                </Box>
                              </Box>

                              {skill.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                  {skill.description}
                                </Typography>
                              )}

                              {/* Medical Context */}
                              {skill.healthcareContext && (
                                <Box
                                  sx={{
                                    p: 1.5,
                                    mb: 3,
                                    bgcolor: 'rgba(13, 71, 161, 0.05)',
                                    borderRadius: 2,
                                  }}
                                >
                                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                                    Clinical Context:
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Patient Impact: {skill.healthcareContext.patientImpact} • Clinical Relevance:{' '}
                                    {skill.healthcareContext.clinicalRelevance}
                                  </Typography>
                                </Box>
                              )}

                              <Divider sx={{ my: 3 }} />

                              {/* Medical Proficiency Selector */}
                              <MedicalProficiencySelector
                                value={assessments[skill._id]?.rating || 0}
                                onChange={(level) => handleProficiencyChange(skill._id, level)}
                                skillName={skill.name}
                              />

                              <Divider sx={{ my: 3 }} />

                              {/* Evidence Upload */}
                              <MedicalEvidenceUpload
                                onFileUpload={(files) => handleEvidenceUpload(skill._id, files)}
                                uploadedFiles={assessments[skill._id]?.evidenceFiles || []}
                              />

                              <Divider sx={{ my: 3 }} />

                              {/* Goal Selector */}
                              <TextField
                                fullWidth
                                select
                                label="Target Proficiency Goal"
                                value={assessments[skill._id]?.goal || ''}
                                onChange={(e) => handleGoalChange(skill._id, e.target.value)}
                                size="small"
                              >
                                <MenuItem value="">No goal set</MenuItem>
                                <MenuItem value="beginner">Novice (Medical Student)</MenuItem>
                                <MenuItem value="intermediate">Intern</MenuItem>
                                <MenuItem value="advanced">Resident</MenuItem>
                                <MenuItem value="expert">Specialist</MenuItem>
                                <MenuItem value="master">Chief of Staff</MenuItem>
                              </TextField>
                            </CardContent>
                          </GlassCard>
                        </SkillTooltip>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            );
          })}
        </motion.div>

        {/* Save Assessment Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleSaveAssessment}
              disabled={loading || Object.keys(assessments).filter((id) => assessments[id]?.rating).length === 0}
              startIcon={loading ? <MedicalIcon /> : <HospitalIcon />}
              sx={{
                minWidth: 250,
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 700,
                background: `linear-gradient(135deg, ${healthcareColors.primary} 0%, ${healthcareColors.secondary} 100%)`,
                boxShadow: '0 4px 20px rgba(13, 71, 161, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 25px rgba(13, 71, 161, 0.4)',
                },
                '&:disabled': {
                  background: 'rgba(0, 0, 0, 0.12)',
                },
              }}
            >
              {loading ? 'Processing Assessment...' : 'Complete Clinical Assessment'}
            </Button>
          </motion.div>
        </Box>
      </Container>
    </PageTransition>
  );
};

export default SkillsAssessment;
