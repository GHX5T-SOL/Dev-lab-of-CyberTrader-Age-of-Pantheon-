/**
 * src/theme/colors.ts - app-local palette mirror for Expo bundling.
 *
 * The canonical source remains brand/color/tokens.ts, but Metro cannot yet
 * resolve imports outside src during export, so the first playable slice keeps
 * a synced local copy here.
 */

export const palette = {
  bg: {
    void: "#05070D",
    terminal: "#05070D",
    deepGreenBlack: "#05070D",
    card: "#05070D",
    elevated: "rgba(20,25,35,0.6)",
    glass: "rgba(20,25,35,0.6)",
  },
  fg: {
    primary: "#FFFFFF",
    muted: "rgba(255,255,255,0.65)",
    dim: "rgba(255,255,255,0.4)",
  },
  accent: {
    cyan: "#00E5FF",
    acidGreen: "#00FFB2",
    magenta: "#8A7CFF",
    violet: "#8A7CFF",
    blue: "#00E5FF",
  },
  danger: {
    heat: "#FF3B3B",
  },
  warn: {
    amber: "#FFC857",
  },
  lore: {
    violet: "#8A7CFF",
  },
  alpha: {
    clear: "transparent",
    black50: "rgba(0,0,0,0.5)",
    black70: "rgba(0,0,0,0.7)",
    cyan10: "rgba(0,229,255,0.1)",
    cyan18: "rgba(0,229,255,0.18)",
    cyan35: "rgba(0,229,255,0.35)",
    magenta10: "rgba(138,124,255,0.1)",
    magenta18: "rgba(138,124,255,0.18)",
    magenta35: "rgba(138,124,255,0.35)",
    violet20: "rgba(138,124,255,0.2)",
    white06: "rgba(255,255,255,0.06)",
    white10: "rgba(255,255,255,0.1)",
    white16: "rgba(255,255,255,0.16)",
  },
} as const;

export type PaletteToken =
  | `bg.${keyof typeof palette.bg}`
  | `fg.${keyof typeof palette.fg}`
  | `accent.${keyof typeof palette.accent}`
  | `danger.${keyof typeof palette.danger}`
  | `warn.${keyof typeof palette.warn}`
  | `lore.${keyof typeof palette.lore}`;
