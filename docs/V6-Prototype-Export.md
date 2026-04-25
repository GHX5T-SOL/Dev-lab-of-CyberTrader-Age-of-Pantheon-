# CyberTrader v6 Prototype Export

Date: 2026-04-24
Status updated: 2026-04-25

CyberTrader: Age of Pantheon v6 is the selected playable prototype moving forward. The actual game source is exported from this Dev Lab repo's `src/` directory to:

https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v6

This version includes the working local authority trade loop, XP/rank progression, inventory slots, real-time clock/ticks, deterministic market news, location travel, heat and raid systems, Black Market heat reduction, courier shipments, and the intro cinematic route.

Deployment note: `src/vercel.json` configures Vercel with `npm run build:web`, `npm run web -- --port 8081`, `dist` output, and SPA rewrites.

## Current v6 game state

CyberTrader v6 is no longer just a UI prototype. It is the current actual game build and the first branch the team should continue hardening.

Systems now in place:

- Core trade loop: buys deduct 0BOL, sells credit 0BOL, positions track quantity/average entry, realized PnL feeds XP, and inventory slot limits are enforced.
- Progression: rank table, XP gains, next-rank pull, inventory slot expansion, streak multipliers, and daily challenge rewards.
- World: 10 locations, unlocked starting districts, travel timers, location price modifiers, district states, Black Market heat reduction, and trading lockouts during travel/blackout states.
- Market pressure: 30-second ticks, deterministic news, flash market events, volatility spikes, arbitrage windows, flash crashes, and district-specific modifiers.
- Risk: heat generation, passive decay, bounty escalation, eAgent scan events, raid checks, inventory losses, and raid-survival XP.
- Couriers: multiple active shipments, courier risk/cost tiers, countdowns, arrival/loss notifications, destination claiming, and away-report summaries.
- Narrative hooks: NPC contacts, timed missions, reputation movement, mission history, and mission banners.
- Feel: profit/loss feedback, heat threshold warnings, rank-up celebration state, animated numbers, and audio-ready code hooks.
- Intro: `/video-intro` plays the shipped MP4 before the text intro and falls through cleanly after skip/end.

## Latest recorded verification

Recorded after the v6 engagement pass:

- `npm run typecheck`
- `npm test -- --runInBand`
- `npx expo export --platform web`
- Browser smoke: MP4 intro route, login/intro handoff, terminal buy loop, inventory/balance update, readable news/status surfaces.

## Dev Lab responsibility

This Dev Lab should now track v6 as the source of truth for playable-game implementation status while keeping docs, task-board ownership, assets, AI Council decisions, roadmap gates, and cross-platform QA here.

Immediate follow-ups:

- Keep PR #10 (`feat: GLB watcher preview sync`) open while it remains draft.
- Continue Phase 1 hardening: Android/iOS runtime validation, economy balance pass, SupabaseAuthority feature flag, and Vercel deployment checks.
- Keep all six prototype references visible, but treat v6 as the active game build.
