import React from 'react';
import { Box, Typography, Tooltip, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const proficiencyLevels = [
  {
    level: 1,
    name: 'Novice',
    medicalTerm: 'Medical Student',
    description: 'Basic understanding, learning fundamentals',
    color: '#9e9e9e',
    icon: '📚',
  },
  {
    level: 2,
    name: 'Intern',
    medicalTerm: 'Intern',
    description: 'Can perform basic tasks under supervision',
    color: '#ff9800',
    icon: '👨‍⚕️',
  },
  {
    level: 3,
    name: 'Resident',
    medicalTerm: 'Resident',
    description: 'Competent in standard procedures',
    color: '#2196f3',
    icon: '🏥',
  },
  {
    level: 4,
    name: 'Specialist',
    medicalTerm: 'Specialist',
    description: 'Expert level, can train others',
    color: '#4caf50',
    icon: '⭐',
  },
  {
    level: 5,
    name: 'Chief of Staff',
    medicalTerm: 'Chief of Staff',
    description: 'Master level, industry leader',
    color: '#9c27b0',
    icon: '👑',
  },
];

const MedicalProficiencySelector = ({ value, onChange, skillName }) => {
  // // const [hoveredLevel, setHoveredLevel] = useState(null);

  const handleLevelClick = (level) => {
    if (onChange) {
      onChange(level);
    }
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 500, mb: 2, color: 'text.secondary' }}>
        Proficiency Assessment
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {proficiencyLevels.map((proficiency) => {
          const isSelected = value === proficiency.level;
          // const isHovered = hoveredLevel === proficiency.level;

          return (
            <Tooltip
              key={proficiency.level}
              title={
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {proficiency.medicalTerm}
                  </Typography>
                  <Typography variant="caption">{proficiency.description}</Typography>
                </Box>
              }
              arrow
            >
              <motion.div
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLevelClick(proficiency.level)}
                style={{ cursor: 'pointer' }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    p: 2,
                    minWidth: 100,
                    borderRadius: 3,
                    border: `2px solid ${isSelected ? proficiency.color : 'rgba(0, 0, 0, 0.2)'}`,
                    bgcolor: isSelected ? `${proficiency.color}20` : 'rgba(255, 255, 255, 0.6)',
                    transition: 'all 0.3s',
                    textAlign: 'center',
                    boxShadow: isSelected
                      ? `0 4px 12px ${proficiency.color}40`
                      : '0 2px 4px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      bgcolor: `${proficiency.color}15`,
                      borderColor: proficiency.color,
                    },
                  }}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        style={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: proficiency.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 2px 8px ${proficiency.color}60`,
                        }}
                      >
                        <Typography sx={{ color: 'white', fontSize: 14 }}>✓</Typography>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Typography variant="h4" sx={{ mb: 0.5 }}>
                    {proficiency.icon}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: isSelected ? 700 : 600,
                      color: isSelected ? proficiency.color : 'text.primary',
                      mb: 0.5,
                    }}
                  >
                    {proficiency.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.7rem',
                    }}
                  >
                    {proficiency.medicalTerm}
                  </Typography>
                </Box>
              </motion.div>
            </Tooltip>
          );
        })}
      </Box>
      {value && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ mt: 2 }}
        >
          <Chip
            label={`Selected: ${proficiencyLevels.find((p) => p.level === value)?.medicalTerm}`}
            sx={{
              bgcolor: `${proficiencyLevels.find((p) => p.level === value)?.color}20`,
              color: proficiencyLevels.find((p) => p.level === value)?.color,
              fontWeight: 600,
            }}
          />
        </motion.div>
      )}
    </Box>
  );
};

export default MedicalProficiencySelector;
