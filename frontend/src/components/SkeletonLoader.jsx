import React from 'react';
import { Skeleton } from '@mui/material';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ variant = 'rectangular', width, height, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Skeleton
            variant={variant}
            width={width}
            height={height}
            animation="pulse"
            sx={{
              borderRadius: 2,
              bgcolor: 'rgba(0, 0, 0, 0.06)',
            }}
          />
        </motion.div>
      ))}
    </>
  );
};

export default SkeletonLoader;
