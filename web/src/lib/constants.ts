export const SITE = {
  name: "CyberTrader Dev Lab",
  tagline: "Virtual office. Neon Void City. Year 2077.",
  phase: process.env.NEXT_PUBLIC_PHASE ?? "Phase 0 — Foundation",
  repo: "https://github.com/GHX5T-SOL/Dev-lab-of-CyberTrader-Age-of-Pantheon-",
} as const;

/**
 * Palette pulled from brand/brand-guidelines.md.
 * Keep in sync with parent repo brand/color/tokens.ts.
 */
export const PALETTE = {
  void: "#050608",
  cyan: "#00F5FF",
  acidGreen: "#67FFB5",
  heat: "#FF2A4D",
  amber: "#FFB341",
  violet: "#7A5BFF",
  ink: "#0A0D12",
  dust: "#8A94A7",
  chrome: "#E8ECF5",
} as const;

export type PaletteKey = keyof typeof PALETTE;
