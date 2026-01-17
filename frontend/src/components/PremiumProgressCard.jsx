import React from 'react';
import { Card, CardContent, Box, Typography, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';

const PremiumProgressCard = ({ title, progress, description, color = '#1E3A5F' }) => {
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        height: '100%',
        border: '1px solid rgba(30, 58, 95, 0.08)',
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(30, 58, 95, 0.04)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(30, 58, 95, 0.1)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#1F2937',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: color,
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: `${color}15`,
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
                borderRadius: 4,
              },
            }}
          />
        </Box>
        {description && (
          <Typography
            variant="body2"
            sx={{
              color: '#6B7280',
              fontSize: '0.875rem',
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PremiumProgressCard;
