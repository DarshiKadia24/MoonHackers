import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, Button, IconButton } from '@mui/material';
import {
  Flip as FlipIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { glassmorphism, healthcareColors } from '../theme';
import MedicalTrainingTimeline from './MedicalTrainingTimeline';
import SurgicalPrecisionSkills from './SurgicalPrecisionSkills';

const CareerFlipCard = ({ careerPath, userSkills = [], onExplore }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const calculateReadiness = () => {
    if (!careerPath.requiredSkills || careerPath.requiredSkills.length === 0) return 100;

    let totalRequired = 0;
    let userMet = 0;

    careerPath.requiredSkills.forEach((reqSkill) => {
      const skillId = reqSkill.skillId?._id || reqSkill.skillId;
      const userSkill = userSkills.find((us) => us.skillId?._id === skillId || us.skillId === skillId);
      const userLevel = userSkill?.proficiency?.level || 'beginner';
      const requiredLevel = reqSkill.requiredLevel || 'intermediate';

      const levels = { beginner: 1, intermediate: 2, advanced: 3, expert: 4, master: 5 };
      const userScore = levels[userLevel.toLowerCase()] || 0;
      const requiredScore = levels[requiredLevel.toLowerCase()] || 0;

      totalRequired += requiredScore;
      userMet += Math.min(userScore, requiredScore);
    });

    return totalRequired > 0 ? Math.round((userMet / totalRequired) * 100) : 0;
  };

  const readiness = calculateReadiness();

  return (
    <Box
      sx={{
        perspective: '1000px',
        height: '100%',
      }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{
          transformStyle: 'preserve-3d',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Front of Card */}
        <motion.div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: 'rotateY(0deg)',
          }}
        >
          <Card
            sx={{
              ...glassmorphism,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(227, 242, 253, 0.9) 0%, rgba(187, 222, 251, 0.9) 100%)',
              border: '2px solid rgba(13, 71, 161, 0.2)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {careerPath.title}
                  </Typography>
                  <Chip
                    label={careerPath.healthcareSpecialty || 'General'}
                    size="small"
                    sx={{
                      bgcolor: healthcareColors.primary,
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <IconButton
                  onClick={() => setIsFlipped(true)}
                  sx={{
                    bgcolor: 'rgba(13, 71, 161, 0.1)',
                    '&:hover': { bgcolor: 'rgba(13, 71, 161, 0.2)' },
                  }}
                >
                  <FlipIcon />
                </IconButton>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                {careerPath.description}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <MoneyIcon sx={{ fontSize: 20, color: healthcareColors.secondary }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Salary Range:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${careerPath.salaryRange?.min?.toLocaleString()} - $
                    {careerPath.salaryRange?.max?.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SchoolIcon sx={{ fontSize: 20, color: healthcareColors.primary }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Required Skills:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {careerPath.requiredSkills?.length || 0} skills
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Your Readiness: {readiness}%
                </Typography>
                <Box
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${readiness}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${
                        readiness >= 80 ? '#4caf50' : readiness >= 60 ? '#ff9800' : healthcareColors.accent
                      } 0%, ${
                        readiness >= 80 ? '#4caf50' : readiness >= 60 ? '#ff9800' : healthcareColors.accent
                      }dd 100%)`,
                    }}
                  />
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                onClick={() => onExplore && onExplore(careerPath)}
                sx={{
                  mt: 'auto',
                  bgcolor: healthcareColors.primary,
                  '&:hover': { bgcolor: healthcareColors.dark },
                }}
              >
                Explore Career Path
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Back of Card */}
        <motion.div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: 'rotateY(180deg)',
          }}
        >
          <Card
            sx={{
              ...glassmorphism,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(227, 242, 253, 0.9) 0%, rgba(187, 222, 251, 0.9) 100%)',
              border: '2px solid rgba(13, 71, 161, 0.2)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {careerPath.title} - Details
                </Typography>
                <IconButton
                  onClick={() => setIsFlipped(false)}
                  sx={{
                    bgcolor: 'rgba(13, 71, 161, 0.1)',
                    '&:hover': { bgcolor: 'rgba(13, 71, 161, 0.2)' },
                  }}
                >
                  <FlipIcon />
                </IconButton>
              </Box>

              <Box sx={{ mb: 3 }}>
                <MedicalTrainingTimeline careerPath={careerPath} currentStage={2} />
              </Box>

              <Box>
                <SurgicalPrecisionSkills
                  requiredSkills={careerPath.requiredSkills || []}
                  userSkills={userSkills}
                />
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default CareerFlipCard;
