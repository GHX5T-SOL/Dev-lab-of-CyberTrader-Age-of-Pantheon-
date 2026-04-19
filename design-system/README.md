# /design-system — Design system contracts

The **code side** of the brand system. Tokens, component contracts, and composition rules that both designers and engineers consume.

## Contents (Phase 0)

- `tokens.ts` — re-exports `brand/color/tokens.ts` plus any design-system-only tokens (spacing, radii, motion timings)

## Contents (Phase 1+)

- `spacing.ts` — 4pt baseline grid
- `motion.ts` — shared durations + easings
- `components/` — typed component contracts (prop shapes) that Frontend/Mobile implements

## Rules

- Brand tokens are the single source of truth. Design-system tokens may **compose** them (e.g., `spacing.s = 4`), but never duplicate color values.
- Components in `src/components/` import from `design-system/`, not from `brand/` directly. This gives us a swap point later if we adopt Tamagui / Restyle.
- Any change here triggers a UI/UX + Frontend/Mobile council subsession.

## See also

- [../brand/brand-guidelines.md](../brand/brand-guidelines.md)
- [../agents/ui-ux-cyberpunk.md](../agents/ui-ux-cyberpunk.md)
