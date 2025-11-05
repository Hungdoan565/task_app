/**
 * Hằng số thiết kế cho toàn bộ ứng dụng
 * Đảm bảo tính nhất quán về màu sắc, animation, và spacing
 */

// ============================================
// MÀU SẮC - THỐNG NHẤT TOÀN BỘ ỨNG DỤNG
// ============================================

export const COLORS = {
  // Màu chính - Chỉ dùng indigo và blue
  primary: {
    indigo: {
      50: 'indigo-50',
      100: 'indigo-100',
      200: 'indigo-200',
      600: 'indigo-600',
    },
    blue: {
      50: 'blue-50',
      100: 'blue-100',
      200: 'blue-200',
      600: 'blue-600',
    },
  },
  
  // Màu nền
  background: {
    light: 'bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-50',
    white: 'bg-white',
    gradient: 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600',
  },
  
  // Màu text
  text: {
    primary: 'text-slate-900',
    secondary: 'text-slate-600',
    white: 'text-white',
  },
  
  // Màu icon background - FLAT COLOR (không dùng gradient)
  iconBg: {
    default: 'bg-indigo-100 text-indigo-600',
  },
  
  // Màu border
  border: {
    default: 'border-slate-200',
    hover: 'hover:border-indigo-200',
  },
} as const

// ============================================
// ANIMATION - CHUẨN HÓA THỜI GIAN VÀ EASING
// ============================================

export const ANIMATION = {
  // Thời gian animation
  duration: {
    fast: 0.2,      // Micro-interactions, hover
    medium: 0.3,    // Default, sections
    slow: 0.5,      // Hero, major elements
  },
  
  // Easing function - Material Design
  easing: [0.4, 0, 0.2, 1] as [number, number, number, number],
  
  // Preset animations cho Framer Motion
  presets: {
    fast: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
    medium: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
    slow: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
  
  // Hover effects
  hover: {
    lift: {
      y: -4,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
    },
    scale: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
    },
    tilt: {
      rotateX: 5,
      rotateY: 5,
      scale: 1.02,
      transition: {
        type: "spring" as const,
        stiffness: 300,
      },
    },
  },
  
  // Fade in animations
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    viewport: { once: true },
  },

  // Fade in animations (reduced motion)
  fadeInReduced: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    viewport: { once: true },
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },

  // Scale animations (reduced motion)
  scaleInReduced: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
} as const

// ============================================
// SPACING - CHUẨN HÓA KHOẢNG CÁCH
// ============================================

export const SPACING = {
  section: {
    sm: 'py-12 md:py-16',
    md: 'py-16 md:py-24',
    lg: 'py-24 md:py-32',
  },
  container: {
    default: 'container mx-auto max-w-7xl px-4',
  },
} as const

// ============================================
// TYPOGRAPHY - SỬ DỤNG DESIGN TOKENS
// ============================================

export const TYPOGRAPHY = {
  heading: {
    hero: 'text-heading-lg md:text-display-md lg:text-display-lg',
    section: 'text-heading-lg md:text-display-sm',
    card: 'text-heading-sm',
  },
  body: {
    large: 'text-body-lg',
    default: 'text-body-md',
  },
} as const

// ============================================
// SHADOW - ĐỘ SÂU VÀ CHIỀU SÂU
// ============================================

export const SHADOW = {
  card: {
    default: 'shadow-sm',
    hover: 'hover:shadow-lg',
  },
  floating: 'shadow-md',
} as const

// ============================================
// BORDER RADIUS
// ============================================

export const RADIUS = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
} as const

