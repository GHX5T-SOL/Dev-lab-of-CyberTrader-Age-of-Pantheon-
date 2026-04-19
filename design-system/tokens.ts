/**
 * design-system/tokens.ts — engineering-facing design tokens.
 *
 * Color tokens re-exported from the brand system. Other tokens (spacing,
 * radii, motion) are defined here because they're engineering primitives
 * rather than brand primitives.
 */

export { palette } from '../brand/color/tokens';

export const spacing = {
  xxs: 2,
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  none: 0,
  s: 2,
  m: 4,       // default — sharp, terminal feel
  l: 8,       // reserved for large surfaces only
} as const;

export const motion = {
  // durations (ms)
  instant: 80,
  quick: 140,
  standard: 220,
  emphasis: 360,
  // easings
  easeOut: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
  // specialty
  glitchStep: 60,   // one-frame glitch hold
} as const;

export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
