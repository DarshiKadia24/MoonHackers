import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedProgressBar = ({ value, label, color = '#0d47a1', height = 8 }) => {
  return (
    <Box sx={{ width: '100%' }}>
      {label && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {Math.round(value)}%
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: height,
          borderRadius: height / 2,
          bgcolor: 'rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
            borderRadius: height / 2,
            boxShadow: `0 0 10px ${color}40`,
          }}
        />
      </Box>
    </Box>
  );
};

export default AnimatedProgressBar;
