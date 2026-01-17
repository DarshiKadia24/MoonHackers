import anime from 'animejs';

/**
 * Premium Animation Helper Utilities
 * Top-notch animations with spring physics, advanced easing, and micro-interactions
 */

// Advanced easing curves for premium feel (animejs v3 compatible)
export const easings = {
  spring: 'easeOutElastic(1, .8)',
  smooth: 'easeInOutQuad',
  smoothOut: 'easeOutExpo',
  smoothIn: 'easeInExpo',
  bounce: 'easeOutBounce',
  elastic: 'easeOutElastic(1, .6)',
  premium: 'easeInOutCubic',
  // Fallback to simple easings if complex ones fail
  simple: 'easeOutQuad',
  simpleIn: 'easeInQuad',
  simpleOut: 'easeOutQuad',
};

/**
 * Premium fade in with smooth easing
 */
export const fadeIn = (targets, options = {}) => {
  if (!targets) return null;
  
  try {
    return anime({
      targets,
      opacity: [0, 1],
      duration: options.duration || 800,
      easing: options.easing || easings.smoothOut,
      delay: options.delay || 0,
      ...options,
    });
  } catch (error) {
    console.warn('Animation error:', error);
    // Fallback to simple animation
    return anime({
      targets,
      opacity: [0, 1],
      duration: options.duration || 800,
      easing: 'easeOutQuad',
      delay: options.delay || 0,
    });
  }
};

/**
 * Premium slide in with spring bounce
 */
export const slideIn = (targets, direction = 'up', options = {}) => {
  if (!targets) return null;
  
  const translateMap = {
    up: { translateY: [60, 0] },
    down: { translateY: [-60, 0] },
    left: { translateX: [60, 0] },
    right: { translateX: [-60, 0] },
  };

  try {
    return anime({
      targets,
      opacity: [0, 1],
      ...translateMap[direction],
      duration: options.duration || 900,
      easing: options.easing || easings.spring,
      delay: options.delay || 0,
      ...options,
    });
  } catch (error) {
    console.warn('Animation error:', error);
    // Fallback to simple animation
    return anime({
      targets,
      opacity: [0, 1],
      ...translateMap[direction],
      duration: options.duration || 900,
      easing: 'easeOutExpo',
      delay: options.delay || 0,
    });
  }
};

/**
 * Premium scale in with elastic bounce
 */
export const scaleIn = (targets, options = {}) => {
  if (!targets) return null;
  
  try {
    return anime({
      targets,
      scale: [0.7, 1.05, 1], // Overshoot then settle
      opacity: [0, 1],
      duration: options.duration || 700,
      easing: options.easing || easings.elastic,
      delay: options.delay || 0,
      ...options,
    });
  } catch (error) {
    console.warn('Animation error:', error);
    // Fallback to simple animation
    return anime({
      targets,
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: options.duration || 700,
      easing: 'easeOutExpo',
      delay: options.delay || 0,
    });
  }
};

/**
 * Premium stagger with cascading effect
 */
export const stagger = (targets, options = {}) => {
  if (!targets || (Array.isArray(targets) && targets.length === 0)) return null;
  
  // Filter out null/undefined targets
  const validTargets = Array.isArray(targets) 
    ? targets.filter(t => t !== null && t !== undefined && t.nodeType !== undefined)
    : (targets && targets.nodeType !== undefined ? targets : null);
  
  if (!validTargets || (Array.isArray(validTargets) && validTargets.length === 0)) return null;
  
  try {
    return anime({
      targets: validTargets,
      opacity: [0, 1],
      translateY: [40, 0],
      scale: [0.85, 1],
      duration: options.duration || 700,
      delay: anime.stagger(options.staggerDelay || 120),
      easing: options.easing || easings.smoothOut,
      ...options,
    });
  } catch (error) {
    console.warn('Stagger animation error:', error);
    // Fallback to simple animation
    return anime({
      targets: validTargets,
      opacity: [0, 1],
      translateY: [40, 0],
      duration: options.duration || 700,
      delay: anime.stagger(options.staggerDelay || 120),
      easing: 'easeOutExpo',
    });
  }
};

/**
 * Premium pulse with smooth heartbeat
 */
export const pulse = (targets, options = {}) => {
  if (!targets) return null;
  
  return anime({
    targets,
    scale: [1, 1.08, 1],
    opacity: [1, 0.9, 1],
    duration: options.duration || 1200,
    easing: options.easing || easings.smooth,
    loop: options.loop !== false,
    ...options,
  });
};

/**
 * Premium rotate with smooth easing
 */
export const rotate = (targets, options = {}) => {
  if (!targets) return null;
  
  return anime({
    targets,
    rotate: options.rotate || 360,
    duration: options.duration || 1000,
    easing: options.easing || easings.smooth,
    loop: options.loop || false,
    ...options,
  });
};

/**
 * Premium progress fill with smooth acceleration
 */
export const progressFill = (targets, value, options = {}) => {
  if (!targets) return null;
  
  return anime({
    targets,
    width: [`0%`, `${value}%`],
    duration: options.duration || 1800,
    easing: options.easing || easings.smoothOut,
    delay: options.delay || 0,
    ...options,
  });
};

/**
 * Premium number counter with spring
 */
export const countUp = (targets, endValue, options = {}) => {
  const element = typeof targets === 'string' ? document.querySelector(targets) : targets;
  if (!element) return;
  
  return anime({
    targets: { value: 0 },
    value: endValue,
    duration: options.duration || 2500,
    easing: options.easing || easings.smoothOut,
    round: 1,
    update: function(anim) {
      if (element.textContent !== undefined) {
        element.textContent = Math.floor(anim.animatables[0].target.value);
      } else if (element.innerHTML !== undefined) {
        element.innerHTML = Math.floor(anim.animatables[0].target.value);
      }
    },
    ...options,
  });
};

/**
 * Premium card hover with depth and glow
 */
export const cardHover = {
  enter: (targets) => {
    if (!targets) return null;
    
    const element = typeof targets === 'string' ? document.querySelector(targets) : targets;
    if (element && element.style) {
      element.style.transition = 'box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      element.style.boxShadow = '0 12px 40px rgba(13, 71, 161, 0.25)';
    }
    return anime({
      targets,
      scale: 1.03,
      translateY: -12,
      rotateZ: 0.5, // Subtle 3D tilt
      duration: 400,
      easing: easings.smoothOut,
    });
  },
  leave: (targets) => {
    if (!targets) return null;
    
    const element = typeof targets === 'string' ? document.querySelector(targets) : targets;
    if (element && element.style) {
      element.style.transition = 'box-shadow 0.4s cubic-bezier(0.4, 0, 1, 1)';
      element.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    }
    return anime({
      targets,
      scale: 1,
      translateY: 0,
      rotateZ: 0,
      duration: 400,
      easing: easings.smoothIn,
    });
  },
};

/**
 * Premium flip card with 3D perspective
 */
export const flipCard = (targets, isFlipped, options = {}) => {
  if (!targets) return null;
  
  return anime({
    targets,
    rotateY: isFlipped ? 180 : 0,
    scale: isFlipped ? [1, 0.95, 1] : [1, 0.95, 1],
    duration: options.duration || 700,
    easing: options.easing || easings.spring,
    ...options,
  });
};

/**
 * Premium bounce in with elastic effect
 */
export const bounceIn = (targets, options = {}) => {
  if (!targets) return null;
  
  return anime({
    targets,
    scale: [0, 1.15, 0.95, 1.05, 1], // Multiple bounces
    opacity: [0, 1],
    rotateZ: [0, 5, -5, 0], // Subtle rotation
    duration: options.duration || 1000,
    easing: options.easing || easings.bounce,
    delay: options.delay || 0,
    ...options,
  });
};

/**
 * Premium shake with smooth recovery
 */
export const shake = (targets, options = {}) => {
  if (!targets) return null;
  
  return anime({
    targets,
    translateX: [0, -12, 12, -8, 8, -4, 4, 0],
    rotateZ: [0, -2, 2, -1, 1, 0],
    duration: options.duration || 600,
    easing: options.easing || easings.smooth,
    ...options,
  });
};

/**
 * Premium page transition with fade and slide
 */
export const pageTransition = {
  enter: (targets) => {
    if (!targets) return null;
    
    return anime({
      targets,
      opacity: [0, 1],
      translateY: [30, 0],
      scale: [0.98, 1],
      duration: 800,
      easing: easings.smoothOut,
    });
  },
  exit: (targets) => {
    if (!targets) return null;
    
    return anime({
      targets,
      opacity: [1, 0],
      translateY: [0, -30],
      scale: [1, 0.98],
      duration: 500,
      easing: easings.smoothIn,
    });
  },
};

/**
 * Premium circular progress with smooth fill
 */
export const circularProgress = (targets, value, options = {}) => {
  if (!targets) return null;
  
  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (value / 100) * circumference;
  
  return anime({
    targets,
    strokeDashoffset: [circumference, offset],
    opacity: [0.3, 1],
    duration: options.duration || 2200,
    easing: options.easing || easings.smoothOut,
    delay: options.delay || 0,
    ...options,
  });
};

/**
 * Premium wave with smooth cascade
 */
export const wave = (targets, options = {}) => {
  if (!targets) return null;
  
  const validTargets = Array.isArray(targets) 
    ? targets.filter(t => t !== null && t !== undefined)
    : targets;
  
  if (!validTargets || (Array.isArray(validTargets) && validTargets.length === 0)) return null;
  
  return anime({
    targets: validTargets,
    translateY: [0, -15, 0],
    scale: [1, 1.05, 1],
    duration: options.duration || 1200,
    easing: options.easing || easings.smooth,
    delay: anime.stagger(options.staggerDelay || 150),
    loop: true,
    ...options,
  });
};

/**
 * Premium glow with pulsing effect
 */
export const glow = (targets, options = {}) => {
  if (!targets) return null;
  
  const element = typeof targets === 'string' ? document.querySelector(targets) : targets;
  if (element && element.style) {
    element.style.transition = 'box-shadow 2.5s cubic-bezier(0.4, 0, 0.2, 1)';
  }
  return anime({
    targets,
    scale: [1, 1.02, 1],
    opacity: [1, 0.95, 1],
    duration: options.duration || 2500,
    easing: options.easing || easings.smooth,
    loop: true,
    update: function(anim) {
      const progress = anim.progress / 100;
      const shadowIntensity = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
      if (element && element.style) {
        element.style.boxShadow = `0 0 ${15 + shadowIntensity * 10}px rgba(13, 71, 161, ${0.4 + shadowIntensity * 0.4})`;
      }
    },
    ...options,
  });
};

/**
 * Premium reveal animation (for scroll-triggered)
 */
export const reveal = (targets, options = {}) => {
  if (!targets) return null;
  
  return anime({
    targets,
    opacity: [0, 1],
    translateY: [50, 0],
    scale: [0.9, 1],
    duration: options.duration || 1000,
    easing: options.easing || easings.spring,
    delay: options.delay || 0,
    ...options,
  });
};

/**
 * Premium float animation (subtle up and down)
 */
export const float = (targets, options = {}) => {
  if (!targets) return null;
  
  return anime({
    targets,
    translateY: [0, -8, 0],
    duration: options.duration || 3000,
    easing: options.easing || easings.smooth,
    loop: true,
    direction: 'alternate',
    ...options,
  });
};

/**
 * Premium stagger grid (for card grids)
 */
export const staggerGrid = (targets, options = {}) => {
  if (!targets) return null;
  
  const validTargets = Array.isArray(targets) 
    ? targets.filter(t => t !== null && t !== undefined)
    : targets;
  
  if (!validTargets || (Array.isArray(validTargets) && validTargets.length === 0)) return null;
  
  return anime({
    targets: validTargets,
    opacity: [0, 1],
    translateY: [50, 0],
    scale: [0.8, 1],
    rotateZ: [-5, 0],
    duration: options.duration || 800,
    delay: anime.stagger(options.staggerDelay || 100, { grid: [options.columns || 3], from: 'center' }),
    easing: options.easing || easings.spring,
    ...options,
  });
};

/**
 * Premium typing effect
 */
export const typeWriter = (targets, text, options = {}) => {
  const element = typeof targets === 'string' ? document.querySelector(targets) : targets;
  if (!element) return;
  
  let currentIndex = 0;
  const speed = options.speed || 50;
  
  const type = () => {
    if (currentIndex < text.length) {
      element.textContent = text.substring(0, currentIndex + 1);
      currentIndex++;
      setTimeout(type, speed);
    } else if (options.onComplete) {
      options.onComplete();
    }
  };
  
  type();
};

/**
 * Premium timeline for choreographed sequences
 */
export const createTimeline = (animations = []) => {
  const tl = anime.timeline({
    easing: easings.smoothOut,
    duration: 800,
  });
  
  animations.forEach((anim) => {
    tl.add(anim);
  });
  
  return tl;
};

const animeHelper = {
  fadeIn,
  slideIn,
  scaleIn,
  stagger,
  staggerGrid,
  pulse,
  rotate,
  progressFill,
  countUp,
  cardHover,
  flipCard,
  bounceIn,
  shake,
  pageTransition,
  circularProgress,
  wave,
  glow,
  reveal,
  float,
  createTimeline,
  typeWriter,
  easings,
};

export default animeHelper;
