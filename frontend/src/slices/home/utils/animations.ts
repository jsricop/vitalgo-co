// Animation utilities for VitalGo home slice components
// Following DEV_CONTEXT animation standards

// Gradient shift animation for hero backgrounds
export const gradientShiftKeyframes = `
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`

// Counter animation for statistics
export const counterAnimation = (start: number, end: number, duration: number = 2000) => {
  return {
    from: start,
    to: end,
    duration,
    ease: 'easeOut'
  }
}

// Fade in animation for cards
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

// Stagger animation for feature cards
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Hover scale animation for interactive elements
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 400, damping: 17 }
}

// Pulse animation for QR codes and medical elements
export const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7]
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
}

// Typing animation for text reveals
export const typingAnimation = (text: string) => {
  return {
    initial: { width: 0 },
    animate: { width: '100%' },
    transition: { duration: text.length * 0.1, ease: 'steps' }
  }
}

// Medical chart animation (for dashboard previews)
export const chartAnimation = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 2, ease: 'easeInOut' }
}

// Floating animation for background elements
export const floatingAnimation = {
  animate: {
    y: [-10, 10, -10],
    x: [-5, 5, -5]
  },
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: 'easeInOut'
  }
}

// VitalGo brand colors for animations (matching Tailwind config)
export const vitalgoColors = {
  green: {
    DEFAULT: '#01EF7F',
    light: '#5AF4AC',
    lighter: '#99F9CC',
    lightest: '#CCFCE5'
  },
  dark: {
    DEFAULT: '#002C41',
    light: '#406171',
    lighter: '#99ABB3',
    lightest: '#CCD5D9'
  }
}

// Healthcare-specific animation presets
export const healthcareAnimations = {
  heartbeat: {
    animate: {
      scale: [1, 1.1, 1]
    },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  },

  qrScan: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: 'backOut' }
  },

  emergencyAlert: {
    animate: {
      backgroundColor: [vitalgoColors.green.DEFAULT, '#ff4444', vitalgoColors.green.DEFAULT]
    },
    transition: {
      duration: 1.5,
      repeat: 3,
      ease: 'easeInOut'
    }
  },

  dataSync: {
    animate: {
      rotate: 360
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear'
    }
  }
}

// CSS class helpers for common animations
export const animationClasses = {
  fadeIn: 'animate-in fade-in duration-500',
  fadeInUp: 'animate-in fade-in slide-in-from-bottom-4 duration-700',
  fadeInDown: 'animate-in fade-in slide-in-from-top-4 duration-700',
  scaleIn: 'animate-in zoom-in-95 duration-300',
  slideInLeft: 'animate-in slide-in-from-left-full duration-500',
  slideInRight: 'animate-in slide-in-from-right-full duration-500',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  spin: 'animate-spin'
}

// Intersection Observer hook for scroll animations
export const useScrollAnimation = (threshold: number = 0.1) => {
  return {
    threshold,
    triggerOnce: true,
    rootMargin: '-50px 0px'
  }
}