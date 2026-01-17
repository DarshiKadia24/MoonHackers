import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@mui/material';
import { fadeIn, cardHover } from '../utils/animeHelper';
import { glassmorphism, shadows } from '../theme';

const GlassCard = ({ children, sx = {}, hover = true, gradient = false, ...props }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      // Premium entrance animation - use setTimeout to ensure DOM is ready
      setTimeout(() => {
        if (cardRef.current) {
          fadeIn(cardRef.current, { 
            duration: 800,
            delay: 0,
            easing: 'easeOutExpo',
          });
        }
      }, 50);
    }
  }, []);

  const handleMouseEnter = () => {
    if (hover && cardRef.current) {
      cardHover.enter(cardRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (hover && cardRef.current) {
      cardHover.leave(cardRef.current);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ 
        opacity: 0,
        transform: 'translateY(20px)',
        willChange: 'transform, opacity',
      }}
    >
      <Card
        sx={{
          ...glassmorphism,
          borderRadius: 5,
          p: 0,
          background: gradient ? 'linear-gradient(135deg, rgba(13, 71, 161, 0.03) 0%, rgba(0, 137, 123, 0.03) 100%)' : glassmorphism.background,
          border: '1px solid rgba(13, 71, 161, 0.12)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          boxShadow: shadows.md,
          '&:hover': hover ? {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: shadows.xl,
            borderColor: 'rgba(13, 71, 161, 0.3)',
          } : {},
          ...sx,
        }}
        {...props}
      >
        <CardContent sx={{ p: 3 }}>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default GlassCard;
