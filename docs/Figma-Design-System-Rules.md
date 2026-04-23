# Figma Design System Rules

> Repo-specific Figma handoff rules derived from the current codebase and the
> Figma design-system prompt generation pass.

## Scope

Use this when translating CyberTrader screens into Figma or bringing Figma work
back into code. These rules are for:
- `src/` Expo Router mobile screens
- `web/` Dev Lab Next.js surfaces

## Tokens

Design tokens for the mobile app live in:
- `src/theme/colors.ts`

Brand canon lives in:
- `brand/brand-guidelines.md`
- `brand/color/tokens.ts`

Use these colors only:
- `bg.void` `#050608`
- `bg.terminal` `#0A0F0D`
- `bg.deepGreenBlack` `#07130E`
- `fg.primary` `#E8F0EE`
- `fg.muted` `#7B8B8A`
- `accent.cyan` `#00F5FF`
- `accent.acidGreen` `#67FFB5`
- `danger.heat` `#FF2A4D`
- `warn.amber` `#FFB341`
- `lore.violet` `#7A5BFF`

Rules:
- cyan is the active player/system color
- acid green means working/profit/energy
- red is only consequences/heat/loss
- violet is lore-only and rare
- avoid generic purple gradient usage

## Typography

Current code style:
- monospace body for terminal/system voice
- restrained larger headings
- tabular numbers for market values

Figma guidance:
- represent terminal copy in mono
- represent headings in a clean grotesk family
- do not use glitch styling for body copy
- keep minimum readable mobile text around the current in-app scale

## Component patterns

Mobile reusable components live in:
- `src/components/section-card.tsx`
- `src/components/resource-chip.tsx`
- `src/components/system-line.tsx`
- `src/components/primary-action.tsx`
- `src/components/commodity-row.tsx`
- `src/components/trade-ticket.tsx`

Design these as a tight terminal system, not unrelated cards.

Shared traits:
- rounded continuous corners
- inset dark surfaces
- thin cyan/acid/amber/red borders
- strong text hierarchy
- no decorative chrome without gameplay function

## Route structure

The current playable slice routes are:
- `/boot`
- `/handle`
- `/terminal`
- `/market`

Figma should mirror that exact Phase 1 flow before expanding into the later
13-screen structure.

## Asset management

Mobile commodity art now lives in:
- `src/assets/commodities/`
- `src/assets/commodity-art.ts`

Web commodity art lives in:
- `web/public/brand/commodities/`

Rules:
- commodity art should be transparent cutout PNGs
- keep silhouettes readable at thumbnail size
- one asset should still read when shown at roughly 54px to 112px

## Styling approach

Mobile:
- inline React Native styles
- no Tailwind
- no CSS modules

Web:
- global CSS + Next.js app structure

Figma handoff should prioritize layout, spacing, hierarchy, and token fidelity,
not web-only effects that do not map to Expo cleanly.

## Handoff rules

- Boot, handle, terminal, and market stay in one visual language.
- Every glowing element must imply system function.
- Market rows must remain readable in portrait mobile.
- Commodity art should support the tape, not overpower it.
- Use the current component structure as the default implementation target.
