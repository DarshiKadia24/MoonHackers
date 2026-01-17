import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
// // import { motion } from 'framer-motion';
import { healthcareColors } from '../theme';

const HospitalMonitorProgress = ({ value, height = 8, color = healthcareColors.primary }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const h = canvas.height;

    let animationFrame;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, h);
      
      // Draw background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, h);

      // Draw progress fill
      const progressWidth = (value / 100) * width;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, progressWidth, h);

      // Draw heart rate line
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const centerY = h / 2;
      const frequency = 0.1;
      const amplitude = h / 4;

      for (let x = 0; x < progressWidth; x++) {
        const y = centerY + Math.sin((x * frequency) + time) * amplitude;
        
        // Add ECG spikes
        if (x % 30 < 3) {
          const spikeY = centerY - h / 2;
          if (x === 0) {
            ctx.moveTo(x, spikeY);
          } else {
            ctx.lineTo(x, spikeY);
            ctx.lineTo(x, y);
          }
        } else {
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      }

      ctx.stroke();
      time += 0.15;
      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, color, height]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: height,
        borderRadius: height / 2,
        overflow: 'hidden',
        bgcolor: 'rgba(0, 0, 0, 0.05)',
      }}
    >
      <canvas
        ref={canvasRef}
        width={300}
        height={height}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </Box>
  );
};

export default HospitalMonitorProgress;
