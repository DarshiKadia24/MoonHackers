import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel, StepContent, Chip, Paper } from '@mui/material';
import { motion } from 'framer-motion';
// import { healthcareColors } from '../theme';

const trainingStages = [
  {
    stage: 'Medical Intern',
    years: 'Year 1-2',
    description: 'Foundation training, broad exposure',
    milestones: ['Complete basic rotations', 'Pass licensing exams', 'Begin specialization'],
    color: '#9e9e9e',
  },
  {
    stage: 'Resident',
    years: 'Year 3-5',
    description: 'Specialized training, increasing responsibility',
    milestones: ['Complete residency program', 'Pass specialty boards', 'Begin independent practice'],
    color: '#2196f3',
  },
  {
    stage: 'Fellow',
    years: 'Year 6-7',
    description: 'Advanced subspecialty training',
    milestones: ['Complete fellowship', 'Research publication', 'Advanced certifications'],
    color: '#4caf50',
  },
  {
    stage: 'Attending',
    years: 'Year 8-12',
    description: 'Independent practice, teaching responsibilities',
    milestones: ['Board certification', 'Clinical excellence', 'Mentor junior staff'],
    color: '#ff9800',
  },
  {
    stage: 'Department Head',
    years: 'Year 12+',
    description: 'Leadership, administration, strategic planning',
    milestones: ['Department leadership', 'Strategic initiatives', 'Industry recognition'],
    color: '#9c27b0',
  },
];

const MedicalTrainingTimeline = ({ careerPath, currentStage = 0 }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
        Medical Training Progression
      </Typography>
      <Stepper orientation="vertical" activeStep={currentStage}>
        {trainingStages.map((stage, index) => (
          <Step key={index} active={index <= currentStage} completed={index < currentStage}>
            <StepLabel
              StepIconComponent={() => (
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: index <= currentStage ? stage.color : 'rgba(0, 0, 0, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </Box>
                </motion.div>
              )}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {stage.stage}
                </Typography>
                <Chip
                  label={stage.years}
                  size="small"
                  sx={{
                    bgcolor: stage.color,
                    color: 'white',
                    fontWeight: 600,
                    mt: 0.5,
                  }}
                />
              </Box>
            </StepLabel>
            <StepContent>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: `${stage.color}10`,
                    borderRadius: 2,
                    border: `2px solid ${stage.color}30`,
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {stage.description}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Key Milestones:
                  </Typography>
                  {stage.milestones.map((milestone, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: stage.color,
                          mr: 1,
                        }}
                      />
                      <Typography variant="caption">{milestone}</Typography>
                    </Box>
                  ))}
                </Paper>
              </motion.div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default MedicalTrainingTimeline;
