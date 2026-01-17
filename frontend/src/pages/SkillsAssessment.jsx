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
  LinearProgress,
  Slider,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  Stars as StarsIcon,
  TrendingUp as TrendingUpIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Upload as UploadIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { skillsAPI, progressAPI, recommendationsAPI } from '../services/api';
import { getUserId } from '../utils/userHelpers';
import PageTransition from '../components/PageTransition';
import ConfettiCelebration from '../components/ConfettiCelebration';
import SkeletonLoader from '../components/SkeletonLoader';
import SkillTooltip from '../components/SkillTooltip';
import PremiumSidebar from '../components/PremiumSidebar';
import PremiumTopBar from '../components/PremiumTopBar';
import { healthcareColors, shadows } from '../theme';

// Professional category mapping
const categoryMapping = {
  Clinical: { name: 'Core Technical Skills', icon: <CodeIcon />, color: healthcareColors.primary },
  Technical: { name: 'Advanced Technical', icon: <StorageIcon />, color: healthcareColors.secondary },
  Regulatory: { name: 'Compliance & Security', icon: <SecurityIcon />, color: '#D4AF37' },
  Analytical: { name: 'Data & Analytics', icon: <AnalyticsIcon />, color: '#6366F1' },
  'Soft Skills': { name: 'Leadership & Communication', icon: <PeopleIcon />, color: '#8B5CF6' },
};

// Proficiency level mapping (replacing medical terminology)
const proficiencyLevels = [
  { value: 1, label: 'Beginner', description: 'Getting started with fundamentals', apiName: 'beginner' },
  { value: 2, label: 'Intermediate', description: 'Comfortable with core concepts', apiName: 'intermediate' },
  { value: 3, label: 'Proficient', description: 'Strong working knowledge', apiName: 'advanced' },
  { value: 4, label: 'Expert', description: 'Advanced mastery and expertise', apiName: 'expert' },
  { value: 5, label: 'Master', description: 'Industry-leading proficiency', apiName: 'master' },
];

const MINIMUM_PROFICIENCY_THRESHOLD = 3; // Proficient level

const proficiencyColors = {
  1: '#94A3B8',
  2: '#6366F1',
  3: '#8B5CF6',
  4: '#D4AF37',
  5: '#F0C850',
};

const SkillsAssessment = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [assessments, setAssessments] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [skillGaps, setSkillGaps] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = [
    { label: 'Core Technical Skills', value: 'Clinical' },
    { label: 'Advanced Technical', value: 'Technical' },
    { label: 'Compliance & Security', value: 'Regulatory' },
    { label: 'Data & Analytics', value: 'Analytical' },
    { label: 'Leadership & Communication', value: 'Soft Skills' },
  ];

  useEffect(() => {
    fetchSkills();
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

    assessedSkills.forEach((skillId) => {
      const assessment = assessments[skillId];
      const skill = skills.find((s) => s._id === skillId);
      if (skill && assessment.rating < MINIMUM_PROFICIENCY_THRESHOLD) {
        gaps.push({
          skillName: skill.name,
          currentLevel: getProficiencyName(assessment.rating),
          requiredLevel: getProficiencyName(MINIMUM_PROFICIENCY_THRESHOLD),
        });
      }
    });

    return gaps;
  };

  const getProficiencyName = (level) => {
    const proficiency = proficiencyLevels.find(p => p.value === level);
    return proficiency ? proficiency.label : 'Not assessed';
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
          const proficiencyLevel = proficiencyLevels.find(p => p.value === assessment.rating);
          const level = proficiencyLevel?.apiName || 'beginner';
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

      // Generate skill gaps and recommendations
      const gaps = calculateSkillGaps();
      setSkillGaps(gaps);
      
      let recs = [];
      try {
        const recResponse = await recommendationsAPI.getUserRecommendations(userId);
        recs = [
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
      
      setRecommendations(recs);

      // Check for milestones
      const assessedSkills = Object.keys(assessments).filter(
        (skillId) => assessments[skillId]?.rating
      ).length;
      
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
        <Box sx={{ display: 'flex', height: '100vh' }}>
          <PremiumSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <PremiumTopBar onMenuClick={() => setSidebarOpen(true)} />
            <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
                  Loading skill assessment...
                </Typography>
                <Box sx={{ mt: 4 }}>
                  <SkeletonLoader variant="rectangular" width="100%" height={200} count={3} />
                </Box>
              </Box>
            </Container>
          </Box>
        </Box>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <PremiumSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <PremiumTopBar onMenuClick={() => setSidebarOpen(true)} />
          
          <Container maxWidth="lg" sx={{ mt: 12, mb: 4, flexGrow: 1 }}>
            <ConfettiCelebration trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

            {/* Premium Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: healthcareColors.gradientPrimary,
                      color: 'white',
                      mr: 3,
                      boxShadow: shadows.colored.primary,
                    }}
                  >
                    <StarsIcon sx={{ fontSize: 40 }} />
                  </Box>
                  <Box>
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
                      Skills Assessment
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Evaluate your professional competencies and track your growth
                    </Typography>
                  </Box>
                </Box>

                {/* Premium Progress Bar */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: healthcareColors.gradientCard,
                    border: `1px solid ${healthcareColors.primary}20`,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: healthcareColors.primary }}>
                      Assessment Progress
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: healthcareColors.primary }}>
                      {Math.round(getOverallProgress())}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getOverallProgress()}
                    sx={{
                      height: 10,
                      borderRadius: 2,
                      bgcolor: 'rgba(30, 58, 95, 0.08)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 2,
                        background: healthcareColors.gradientPrimary,
                      },
                    }}
                  />
                </Paper>
              </Box>
            </motion.div>

            {/* Success Alert */}
            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert
                    icon={<CheckCircleIcon />}
                    severity="success"
                    sx={{
                      mb: 3,
                      borderRadius: 3,
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
                    }}
                  >
                    Skills assessment saved successfully! Your progress has been updated.
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Skill Gaps & Recommendations */}
            {(skillGaps.length > 0 || recommendations.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.15)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TrophyIcon sx={{ fontSize: 32, color: healthcareColors.secondary, mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Growth Opportunities
                    </Typography>
                  </Box>

                  {skillGaps.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                        Skills to Improve:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {skillGaps.slice(0, 5).map((gap, index) => (
                          <Chip
                            key={index}
                            label={`${gap.skillName}: ${gap.currentLevel} → ${gap.requiredLevel}`}
                            sx={{
                              bgcolor: 'rgba(99, 102, 241, 0.1)',
                              color: healthcareColors.secondary,
                              fontWeight: 500,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {recommendations.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                        Recommended Resources:
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {recommendations.slice(0, 3).map((rec, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: 'white',
                              border: '1px solid rgba(99, 102, 241, 0.1)',
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {rec.title || rec.name}
                            </Typography>
                            <Chip
                              label={rec.type}
                              size="small"
                              sx={{ mt: 0.5, bgcolor: 'rgba(99, 102, 241, 0.1)' }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Paper>
              </motion.div>
            )}

            {/* Category Tabs */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${healthcareColors.primary}15`,
                overflow: 'hidden',
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  borderBottom: `1px solid ${healthcareColors.primary}15`,
                  px: 2,
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    minHeight: 56,
                  },
                  '& .Mui-selected': {
                    color: healthcareColors.primary,
                  },
                }}
              >
                {categories.map((category) => (
                  <Tab key={category.value} label={category.label} />
                ))}
              </Tabs>

              {/* Tab Content */}
              <Box sx={{ p: 4 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {categories.map((category, catIndex) => {
                      if (catIndex !== activeTab) return null;

                      const categorySkills = getSkillsByCategory(category.value);
                      const categoryInfo = categoryMapping[category.value];

                      if (categorySkills.length === 0) {
                        return (
                          <Box key={category.value} sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="body1" color="text.secondary">
                              No skills found in this category
                            </Typography>
                          </Box>
                        );
                      }

                      return (
                        <Box key={category.value}>
                          {/* Category Header */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 4,
                              p: 3,
                              borderRadius: 3,
                              background: `linear-gradient(135deg, ${categoryInfo.color}10 0%, ${categoryInfo.color}05 100%)`,
                              border: `1px solid ${categoryInfo.color}30`,
                            }}
                          >
                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${categoryInfo.color} 0%, ${categoryInfo.color}dd 100%)`,
                                color: 'white',
                                mr: 2.5,
                                boxShadow: `0 4px 12px ${categoryInfo.color}40`,
                              }}
                            >
                              {categoryInfo.icon}
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                                {categoryInfo.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Assess {categorySkills.length} professional skills
                              </Typography>
                            </Box>
                            <Chip
                              label={`${categorySkills.length} Skills`}
                              sx={{
                                bgcolor: categoryInfo.color,
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                height: 32,
                              }}
                            />
                          </Box>

                          {/* Skills Grid */}
                          <Grid container spacing={3}>
                            {categorySkills.map((skill, index) => (
                              <Grid item xs={12} md={6} key={skill._id}>
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <SkillTooltip skill={skill}>
                                    <Paper
                                      elevation={0}
                                      sx={{
                                        height: '100%',
                                        borderRadius: 3,
                                        border: `1px solid ${categoryInfo.color}20`,
                                        transition: 'all 0.3s ease',
                                        overflow: 'hidden',
                                        '&:hover': {
                                          transform: 'translateY(-4px)',
                                          boxShadow: `0 8px 24px ${categoryInfo.color}20`,
                                          borderColor: `${categoryInfo.color}40`,
                                        },
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          height: 4,
                                          background: `linear-gradient(90deg, ${categoryInfo.color} 0%, ${categoryInfo.color}80 100%)`,
                                        }}
                                      />
                                      <CardContent sx={{ p: 3 }}>
                                        {/* Skill Header */}
                                        <Box sx={{ mb: 3 }}>
                                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                            {skill.name}
                                          </Typography>
                                          <Chip
                                            label={category.label}
                                            size="small"
                                            sx={{
                                              bgcolor: `${categoryInfo.color}15`,
                                              color: categoryInfo.color,
                                              fontWeight: 600,
                                              fontSize: '0.75rem',
                                            }}
                                          />
                                        </Box>

                                        {skill.description && (
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 3, lineHeight: 1.6 }}
                                          >
                                            {skill.description}
                                          </Typography>
                                        )}

                                        <Divider sx={{ my: 3 }} />

                                        {/* Proficiency Level Selector */}
                                        <Box sx={{ mb: 3 }}>
                                          <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 600, mb: 2 }}
                                          >
                                            Current Proficiency Level
                                          </Typography>
                                          <Box sx={{ px: 1 }}>
                                            <Slider
                                              value={assessments[skill._id]?.rating || 0}
                                              onChange={(e, value) => handleProficiencyChange(skill._id, value)}
                                              min={0}
                                              max={5}
                                              step={1}
                                              marks={proficiencyLevels.map(p => ({
                                                value: p.value,
                                                label: '',
                                              }))}
                                              sx={{
                                                '& .MuiSlider-thumb': {
                                                  bgcolor: proficiencyColors[assessments[skill._id]?.rating] || '#94A3B8',
                                                  width: 20,
                                                  height: 20,
                                                  '&:hover, &.Mui-focusVisible': {
                                                    boxShadow: `0 0 0 8px ${proficiencyColors[assessments[skill._id]?.rating]}30`,
                                                  },
                                                },
                                                '& .MuiSlider-track': {
                                                  background: `linear-gradient(90deg, #94A3B8 0%, ${proficiencyColors[assessments[skill._id]?.rating] || '#94A3B8'} 100%)`,
                                                  border: 'none',
                                                  height: 6,
                                                },
                                                '& .MuiSlider-rail': {
                                                  bgcolor: 'rgba(148, 163, 184, 0.2)',
                                                  height: 6,
                                                },
                                                '& .MuiSlider-mark': {
                                                  bgcolor: 'white',
                                                  border: '2px solid rgba(148, 163, 184, 0.3)',
                                                  width: 10,
                                                  height: 10,
                                                  borderRadius: '50%',
                                                },
                                              }}
                                            />
                                          </Box>
                                          {assessments[skill._id]?.rating > 0 && (
                                            <Box
                                              sx={{
                                                mt: 2,
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: `${proficiencyColors[assessments[skill._id]?.rating]}15`,
                                              }}
                                            >
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  fontWeight: 600,
                                                  color: proficiencyColors[assessments[skill._id]?.rating],
                                                }}
                                              >
                                                {proficiencyLevels[assessments[skill._id]?.rating - 1]?.label}
                                              </Typography>
                                              <Typography variant="caption" color="text.secondary">
                                                {proficiencyLevels[assessments[skill._id]?.rating - 1]?.description}
                                              </Typography>
                                            </Box>
                                          )}
                                        </Box>

                                        <Divider sx={{ my: 3 }} />

                                        {/* Evidence Upload Section */}
                                        <Box sx={{ mb: 3 }}>
                                          <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 600, mb: 1.5 }}
                                          >
                                            Supporting Evidence (Optional)
                                          </Typography>
                                          <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<UploadIcon />}
                                            fullWidth
                                            sx={{
                                              textTransform: 'none',
                                              borderRadius: 2,
                                              borderColor: `${categoryInfo.color}30`,
                                              color: categoryInfo.color,
                                              '&:hover': {
                                                borderColor: categoryInfo.color,
                                                bgcolor: `${categoryInfo.color}05`,
                                              },
                                            }}
                                            onClick={() => {
                                              // File upload logic would go here
                                              const input = document.createElement('input');
                                              input.type = 'file';
                                              input.multiple = true;
                                              input.onchange = (e) => handleEvidenceUpload(skill._id, Array.from(e.target.files));
                                              input.click();
                                            }}
                                          >
                                            Upload Certificates or Projects
                                          </Button>
                                          {assessments[skill._id]?.evidenceFiles?.length > 0 && (
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                              {assessments[skill._id].evidenceFiles.length} file(s) uploaded
                                            </Typography>
                                          )}
                                        </Box>

                                        <Divider sx={{ my: 3 }} />

                                        {/* Target Goal Selector */}
                                        <TextField
                                          fullWidth
                                          select
                                          label="Target Proficiency Goal"
                                          value={assessments[skill._id]?.goal || ''}
                                          onChange={(e) => handleGoalChange(skill._id, e.target.value)}
                                          size="small"
                                          sx={{
                                            '& .MuiOutlinedInput-root': {
                                              borderRadius: 2,
                                            },
                                          }}
                                        >
                                          <MenuItem value="">No goal set</MenuItem>
                                          <MenuItem value="beginner">Beginner</MenuItem>
                                          <MenuItem value="intermediate">Intermediate</MenuItem>
                                          <MenuItem value="advanced">Proficient</MenuItem>
                                          <MenuItem value="expert">Expert</MenuItem>
                                          <MenuItem value="master">Master</MenuItem>
                                        </TextField>
                                      </CardContent>
                                    </Paper>
                                  </SkillTooltip>
                                </motion.div>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </Box>
            </Paper>

            {/* Save Assessment Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSaveAssessment}
                  disabled={loading || Object.keys(assessments).filter((id) => assessments[id]?.rating).length === 0}
                  startIcon={loading ? <TrendingUpIcon /> : <CheckCircleIcon />}
                  sx={{
                    minWidth: 280,
                    py: 2,
                    px: 5,
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    background: healthcareColors.gradientPrimary,
                    boxShadow: shadows.colored.primary,
                    textTransform: 'none',
                    '&:hover': {
                      boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: 'rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  {loading ? 'Saving Assessment...' : 'Save Skills Assessment'}
                </Button>
              </motion.div>
            </Box>
          </Container>
        </Box>
      </Box>
    </PageTransition>
  );
};

export default SkillsAssessment;
