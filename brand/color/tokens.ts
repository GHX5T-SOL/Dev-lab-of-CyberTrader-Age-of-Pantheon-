/**
 * brand/color/tokens.ts — canonical palette as TypeScript tokens.
 *
 * Imported by src/theme/ and design-system/. Never duplicate hex values
 * elsewhere; import from here.
 */

export const palette = {
  bg: {
    void: '#050608',
    terminal: '#0A0F0D',
    deepGreenBlack: '#07130E',
  },
  fg: {
    primary: '#E8F0EE',
    muted: '#7B8B8A',
  },
  accent: {
    cyan: '#00F5FF',
    acidGreen: '#67FFB5',
  },
  danger: {
    heat: '#FF2A4D',
  },
  warn: {
    amber: '#FFB341',
  },
  lore: {
    violet: '#7A5BFF', // rare use only — memory shards, Pantheon whispers
  },
} as const;

export type PaletteToken =
  | `bg.${keyof typeof palette.bg}`
  | `fg.${keyof typeof palette.fg}`
  | `accent.${keyof typeof palette.accent}`
  | `danger.${keyof typeof palette.danger}`
  | `warn.${keyof typeof palette.warn}`
  | `lore.${keyof typeof palette.lore}`;
