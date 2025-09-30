# EduBot School Color System Documentation

This document explains how to use the consistent color system across the EduBot School application.

## Overview

Our color system is built around three core concepts:
- **Growth & Learning**: Emerald greens representing progress and success
- **Innovation & Technology**: Teal blues for modern, tech-forward thinking  
- **Energy & Enthusiasm**: Amber/Orange for creativity and engagement

## Files Structure

```
src/styles/
├── colors.ts         # TypeScript color constants and utilities
├── theme.css         # CSS custom properties and utility classes
└── styles.css        # Global styles and imports
```

## Usage Methods

### 1. Tailwind CSS Classes (Recommended)

Use Tailwind's color classes directly in your components:

```tsx
// Primary colors
<div className="bg-emerald-600 text-white">Primary Button</div>
<div className="bg-teal-600 text-white">Secondary Button</div>
<div className="bg-amber-600 text-white">Accent Button</div>

// Gradients
<div className="bg-gradient-to-r from-emerald-600 to-amber-600">
  Primary Gradient
</div>

// Hover states
<button className="bg-emerald-600 hover:bg-emerald-700 transition-colors">
  Hover Effect
</button>
```

### 2. CSS Custom Properties

Use CSS variables for custom styling:

```css
.custom-element {
  background: var(--gradient-primary);
  color: var(--text-inverse);
  border: 1px solid var(--border-accent);
}

.navigation {
  background: var(--nav-background);
  backdrop-filter: blur(8px);
}
```

### 3. TypeScript Constants

Import and use color constants in JavaScript/TypeScript:

```tsx
import { colors, colorCombinations } from '../styles/colors';

// Direct color access
const buttonStyle = {
  backgroundColor: colors.primary.emerald[600],
  color: colors.text.inverse,
};

// Using combinations
const cardProps = {
  className: `${colorCombinations.cards.background} ${colorCombinations.cards.border}`,
};
```

### 4. Utility Classes

Use pre-built utility classes from theme.css:

```tsx
<div className="card">Card with consistent styling</div>
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<span className="text-brand">Brand colored text</span>
```

## Color Categories

### Primary Colors
- **Emerald** (`emerald-*`): Main brand color, success states, CTAs
- **Teal** (`teal-*`): Secondary brand color, info states, accents
- **Amber** (`amber-*`): Accent color, warnings, highlights

### Secondary Colors
- **Orange** (`orange-*`): Energy, enthusiasm, creative elements
- **Green** (`green-*`): Success confirmations, positive feedback

### Neutral Colors
- **Gray** (`gray-*`): Text, borders, backgrounds
- **White/Black**: High contrast elements

## Gradient Combinations

### Available Gradients
```css
/* Primary brand gradient */
from-emerald-600 to-amber-600

/* Alternative primary */
from-emerald-600 to-teal-600

/* Secondary gradient */
from-teal-600 to-amber-600

/* Background gradients */
from-emerald-50 via-white to-amber-50
from-gray-50 to-emerald-50

/* CTA gradient */
from-emerald-600 via-teal-600 to-amber-600
```

## Component Examples

### Navigation
```tsx
<nav className="bg-white/80 backdrop-blur-md border-b border-gray-100">
  <a href="#" className="text-gray-700 hover:text-emerald-600">Link</a>
  <button className="bg-gradient-to-r from-emerald-600 to-amber-600 text-white">
    Get Started
  </button>
</nav>
```

### Feature Cards
```tsx
<div className="group p-8 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all">
  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
    <Icon className="w-6 h-6 text-white" />
  </div>
  <h3 className="text-xl font-semibold text-gray-800">Feature Title</h3>
  <p className="text-gray-600">Feature description</p>
</div>
```

### Buttons
```tsx
// Primary CTA
<button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-lg rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg">
  Primary Action
</button>

// Secondary Button
<button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold text-lg rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-all">
  Secondary Action
</button>
```

### Stats/Metrics
```tsx
<div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm">
  <div className="text-3xl font-bold text-emerald-600 mb-2">10K+</div>
  <div className="text-gray-600">Active Students</div>
</div>
```

## Best Practices

### Do's ✅
- Use the predefined color combinations for consistency
- Stick to the established gradient patterns
- Use hover states with slightly darker shades
- Maintain proper contrast ratios for accessibility
- Use semantic colors for their intended purposes

### Don'ts ❌
- Don't create custom colors outside the palette
- Don't mix inconsistent gradient directions
- Don't use colors that break accessibility guidelines
- Don't override the color system without good reason

## Accessibility

All colors have been chosen to meet WCAG 2.1 AA standards:
- Text contrast ratios are 4.5:1 or higher
- Interactive elements have clear focus states
- Color is not the only way to convey information

## Dark Mode Support

The color system includes CSS custom properties that automatically adapt to dark mode preferences:

```css
@media (prefers-color-scheme: dark) {
  /* Automatic dark mode adaptations */
}
```

## Extending the Color System

When adding new colors:

1. Add to `colors.ts` with proper TypeScript types
2. Add corresponding CSS custom properties to `theme.css`
3. Update this documentation
4. Ensure accessibility compliance
5. Add to Tailwind config if needed

## Migration Guide

When updating existing components:

1. Replace hardcoded colors with Tailwind classes
2. Use gradient utilities instead of custom CSS
3. Update hover states to use consistent patterns
4. Test for accessibility compliance

This color system ensures visual consistency, accessibility compliance, and easy maintenance across the entire EduBot School application.