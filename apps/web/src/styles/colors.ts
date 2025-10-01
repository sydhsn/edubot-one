// EduBot School Color Palette
// A fresh, modern color scheme representing growth, innovation, and energy

export const colors = {
  // Primary Colors - Main brand colors
  primary: {
    emerald: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669', // Main emerald
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    teal: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488', // Main teal
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
    amber: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706', // Main amber
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
  },

  // Secondary Colors - Supporting colors
  secondary: {
    orange: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c', // Main orange
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    green: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a', // Main green
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
  },

  // Neutral Colors - Text, backgrounds, borders
  neutral: {
    white: '#ffffff',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    black: '#000000',
  },

  // Gradient Combinations
  gradients: {
    primary: 'from-emerald-600 to-amber-600',
    primaryAlt: 'from-emerald-600 to-teal-600',
    secondary: 'from-teal-600 to-amber-600',
    background: 'from-emerald-50 via-white to-amber-50',
    backgroundAlt: 'from-gray-50 to-emerald-50',
    cta: 'from-emerald-600 via-teal-600 to-amber-600',
  },

  // Semantic Colors - For specific use cases
  semantic: {
    success: '#10b981', // emerald-600
    warning: '#f59e0b', // amber-500
    error: '#ef4444',   // red-500
    info: '#0d9488',    // teal-600
  },

  // Text Colors
  text: {
    primary: '#1f2937',    // gray-800
    secondary: '#6b7280',  // gray-500
    muted: '#9ca3af',      // gray-400
    inverse: '#ffffff',    // white
    brand: '#059669',      // emerald-600
  },

  // Background Colors
  background: {
    primary: '#ffffff',    // white
    secondary: '#f9fafb',  // gray-50
    accent: '#ecfdf5',     // emerald-50
    muted: '#f3f4f6',      // gray-100
  },

  // Border Colors
  border: {
    light: '#e5e7eb',      // gray-200
    medium: '#d1d5db',     // gray-300
    dark: '#9ca3af',       // gray-400
    accent: '#a7f3d0',     // emerald-200
  },
} as const;

// Type definitions for better TypeScript support
export type ColorPalette = typeof colors;
export type PrimaryColors = keyof typeof colors.primary;
export type SecondaryColors = keyof typeof colors.secondary;
export type NeutralShades = keyof typeof colors.neutral.gray;

// Utility functions for easy color access
export const getColor = (path: string): string => {
  const keys = path.split('.');
  let current: Record<string, unknown> = colors;
  
  for (const key of keys) {
    current = current[key] as Record<string, unknown>;
    if (current === undefined) {
      return colors.neutral.gray[500];
    }
  }
  
  return current as unknown as string;
};

// Common color combinations for quick access
export const colorCombinations = {
  navigation: {
    background: 'bg-white/80',
    text: colors.text.primary,
    hover: colors.primary.emerald[600],
    border: colors.border.light,
  },
  buttons: {
    primary: {
      background: colors.gradients.primary,
      text: colors.text.inverse,
      hover: 'from-emerald-700 to-amber-700',
    },
    secondary: {
      background: 'transparent',
      text: colors.primary.emerald[600],
      border: colors.border.medium,
      hover: colors.background.accent,
    },
  },
  cards: {
    background: colors.background.primary,
    border: colors.border.light,
    shadow: 'shadow-lg',
    hover: {
      border: colors.primary.emerald[200],
      shadow: 'shadow-xl',
    },
  },
  features: {
    emerald: {
      icon: colors.gradients.primary,
      hover: colors.primary.emerald[200],
    },
    teal: {
      icon: 'from-teal-500 to-teal-600',
      hover: colors.primary.teal[200],
    },
    amber: {
      icon: 'from-amber-500 to-amber-600',
      hover: colors.primary.amber[200],
    },
    orange: {
      icon: 'from-orange-500 to-orange-600',
      hover: colors.secondary.orange[200],
    },
  },
} as const;

export default colors;