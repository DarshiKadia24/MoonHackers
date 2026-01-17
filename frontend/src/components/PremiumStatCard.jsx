import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const PremiumStatCard = ({ title, value, icon, subtitle, color = '#1E3A5F' }) => {
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: '#6B7280',
                fontWeight: 500,
                fontSize: '0.875rem',
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: '#1F2937',
                fontWeight: 700,
                fontSize: '2rem',
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${color}10`,
              color: color,
            }}
          >
            {icon}
          </Box>
        </Box>
        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: '#9CA3AF',
              fontSize: '0.8125rem',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PremiumStatCard;
