import React, { useState } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import {
  EmergencyRecording as EmergencyIcon,
  Healing as WardIcon,
  MedicalServices as SurgeryIcon,
  SupervisorAccount as LeadershipIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { healthcareColors } from '../theme';

const departmentConfig = {
  emergency: {
    name: 'Emergency Room',
    icon: <EmergencyIcon />,
    color: healthcareColors.accent,
    level: 'Entry',
    description: 'Fast-paced, broad experience',
  },
  ward: {
    name: 'Specialized Wards',
    icon: <WardIcon />,
    color: healthcareColors.primary,
    level: 'Mid',
    description: 'Focused specialization',
  },
  surgery: {
    name: 'Surgical Suites',
    icon: <SurgeryIcon />,
    color: healthcareColors.secondary,
    level: 'Senior',
    description: 'Advanced procedures',
  },
  leadership: {
    name: 'Leadership Floor',
    icon: <LeadershipIcon />,
    color: '#9c27b0',
    level: 'Executive',
    description: 'Strategic leadership',
  },
};

const HospitalFloorPlan = ({ careerPaths = [], onDepartmentClick, selectedDepartment }) => {
  const [hoveredDept, setHoveredDept] = useState(null);

  const categorizeCareers = () => {
    const categorized = {
      emergency: [],
      ward: [],
      surgery: [],
      leadership: [],
    };

    careerPaths.forEach((path) => {
      const salary = path.salaryRange?.min || 0;
      if (salary < 60000) {
        categorized.emergency.push(path);
      } else if (salary < 90000) {
        categorized.ward.push(path);
      } else if (salary < 130000) {
        categorized.surgery.push(path);
      } else {
        categorized.leadership.push(path);
      }
    });

    return categorized;
  };

  const categorized = categorizeCareers();

  return (
    <Box
      sx={{
        perspective: '1000px',
        perspectiveOrigin: '50% 50%',
        minHeight: 500,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 3,
          transformStyle: 'preserve-3d',
        }}
      >
        {Object.entries(departmentConfig).map(([key, dept]) => {
          const careers = categorized[key] || [];
          const isSelected = selectedDepartment === key;
          const isHovered = hoveredDept === key;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ delay: Object.keys(departmentConfig).indexOf(key) * 0.1 }}
              whileHover={{ scale: 1.05, z: 50 }}
              onHoverStart={() => setHoveredDept(key)}
              onHoverEnd={() => setHoveredDept(null)}
              onClick={() => onDepartmentClick && onDepartmentClick(key)}
              style={{
                cursor: 'pointer',
                transformStyle: 'preserve-3d',
              }}
            >
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 4,
                  background: `linear-gradient(135deg, ${dept.color}15 0%, ${dept.color}05 100%)`,
                  border: `3px solid ${isSelected ? dept.color : 'rgba(0, 0, 0, 0.1)'}`,
                  boxShadow: isHovered
                    ? `0 12px 40px ${dept.color}40`
                    : isSelected
                    ? `0 8px 24px ${dept.color}30`
                    : '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: dept.color,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: dept.color,
                      color: 'white',
                      mr: 2,
                    }}
                  >
                    {dept.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {dept.name}
                    </Typography>
                    <Chip
                      label={dept.level}
                      size="small"
                      sx={{
                        bgcolor: dept.color,
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {dept.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: dept.color }}>
                    {careers.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Career Path{careers.length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
};

export default HospitalFloorPlan;
