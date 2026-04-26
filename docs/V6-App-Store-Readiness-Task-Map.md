# CyberTrader v6 App Store Readiness Task Map

Updated: 2026-04-26

## Mission

Take `CyberTrader-Age-of-Pantheon-v6` from current playable prototype to App Store / Play Store submission readiness.

- Active game repo: `https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v6`
- Live web deployment: `https://cyber-trader-age-of-pantheon-v6.vercel.app`
- Control plane: this Dev Lab repo

The Dev Lab 3D office is now a completed studio milestone. New work should improve the actual game unless explicitly marked as studio operations.

## Release Gates

### Gate A - Reliable Demo
- Web export passes.
- Browser smoke passes: intro -> login -> terminal -> buy -> sell -> inventory/profile/settings.
- No blank screens, dead-end routes, or raw console errors.
- First profitable sell can be completed without developer guidance.

### Gate B - Native Internal Testing
- EAS preview/internal profiles exist.
- iOS simulator smoke passes.
- Android emulator smoke passes.
- Device storage reset/recovery exists.
- Crash/log capture path exists.

### Gate C - Store Candidate
- App icon, splash, screenshots, preview video, age rating notes, privacy copy, and support URL are ready.
- SupabaseAuthority scope is either complete behind a feature flag or explicitly deferred.
- Legal/security notes cover simulated trading, $OBOL naming, wallet flags, and privacy.
- App Store and Play Store internal builds are submitted.

## Owner Map

### Ghost - Lead Developer
- Define release gates and direct-push automation criteria.
- Audit v6 architecture for Expo/EAS/store risk.
- Approve the first TestFlight and Play Internal Testing build plan.
- Decide SupabaseAuthority launch scope.
- Review autonomous commits daily until release branch stabilizes.

### Zoro - Creative Lead
- Review the first 10-minute player journey.
- Approve store screenshot and preview video direction.
- Art-direct commodity, faction, and OS upgrade presentation.
- Tighten tutorial copy and mood.
- Reject any screen that feels like a generic dashboard instead of a cyberdeck.

### Game Designer Agent / Nyx
- Tighten first-session flow from intro to first profitable sell.
- Tune Energy, Heat, raid, courier, and bounty pressure for a 10-minute demo.
- Design Phase 2 faction choice and AgentOS unlock requirements.
- Produce player archetypes for first beta tuning.

### UI/UX & Cyberpunk Aesthetic / Vex
- Polish mobile HUD readability and one-hand ergonomics.
- Run responsive pass for web, small phone, large phone, and tablet.
- Create error, empty, offline, and loading states.
- Make every screen feel diegetic.

### Frontend/Mobile / Rune
- Run technical audit: typecheck, tests, export, route map, dependency review.
- Harden Expo Router navigation and back paths.
- Implement native-safe persistence hydration and reset controls.
- Create EAS build profiles for preview, internal, and store candidates.
- Add crash/log capture suitable for TestFlight and Play Internal Testing.

### Backend/Web3 / Kite
- Implement SupabaseAuthority behind a feature flag.
- Define launch-safe identity and account recovery.
- Prepare Supabase migrations for ledger, positions, player state, and events.
- Write security review for $OBOL naming, wallet flags, and store-safe claims.

### Economy & Trading / Oracle
- Maintain the completed 1000-seed deterministic replay harness.
- Tune volatility, Heat, Energy, raid, bounty, and courier thresholds.
- Produce economy reports that drive concrete tuning patches.

### Cinematic & Animation / Reel
- Create App Store preview storyboard and capture plan.
- Polish intro handoff timing and skip behavior.
- Prepare launch trailer script.

### Brand & Asset / Palette
- Audit all v6 assets for resolution, ownership, and store safety.
- Create missing faction, OS tier, badge, notification, icon, and screenshot assets.
- Create screenshot-safe visual state presets.

### Research & Best Practices / Cipher
- Verify 2026 Apple/Google store submission requirements.
- Research privacy, simulated trading, token naming, and age-rating risks.
- Find relevant ClawdHub/OpenClaw skills for coding, QA, and release ops.

### QA & Testing / Axiom
- Run Web/iOS/Android QA.
- Create store-submission regression checklist.
- Define cold-start, memory, bundle, and interaction-latency budgets.
- Add an automated smoke path.

### Project Manager / Compass
- Keep roadmap/task map/status in sync.
- Create v6 GitHub issue batches from this task map.
- Run weekly AI Council app-store readiness checkpoint.

### OpenClaw Governance / Talon
- Configure Zara/Zyra autonomous loops.
- Enforce no-force-push/no-secrets/no-on-chain safety rails.
- Maintain rollback and incident protocol.

### ElizaOS Swarm / Hydra
- Build market swarm simulation scenarios.
- Prototype synthetic retention/churn scenarios for beta.

### Zara - OpenClaw Asset/Implementation Ops
- Keep OpenClaw current on `brucewayne@100.117.148.52`.
- Maintain the clean v6 workspace and task-runner prompt binding.
- Run recurring implementation scout loop against v6 P0/P1 tasks.
- Build asset optimization queue for Expo mobile assets.

### Zyra - OpenClaw Node Watch / PM-QA
- Run hourly v6 repo health and task-sync loop.
- Watch live Vercel deployment and build status.
- Maintain autonomous run ledger.
- Auto-pick unowned follow-up work when the board is empty.

## Autonomous Work Contract

Agents may work without human review when all of these are true:

1. The task is in this map or is a directly necessary follow-up.
2. The change is scoped and reversible.
3. The agent pulls before starting.
4. The agent runs relevant checks before pushing.
5. The commit message includes the task ID.
6. The task/status docs are updated in the same commit.

Hard stops:

- Do not force-push.
- Do not commit secrets.
- Do not print API keys in logs.
- Do not perform on-chain or real-money actions.
- Do not delete user data or production data.

## Command Checklist

For v6:

```bash
git pull --ff-only
npm install
npm run typecheck
npm test -- --runInBand
npx expo export --platform web
```

For Dev Lab planning sync:

```bash
git pull --ff-only
cd web && npm run typecheck && npm run build
git status
```

## Current Progress

- `rune-p0-001` is complete: v6 `npm install`, `npm run typecheck`, `npm test -- --runInBand`, and `npx expo export --platform web` pass locally on 2026-04-26.
- The v6 audit route map and dependency notes are logged in the v6 repo at `docs/release/rune-p0-001-technical-audit.md`.
- The root v6 typecheck now targets the Expo app and excludes the standalone Remotion `cinematics/` package, which has its own package and TypeScript config.
- `rune-p0-002` is complete: protected player routes now recover after hydration when deep-linked without a local player, the `/` entry route uses shared phase-to-route logic, and menu/Android back actions use safe empty-stack fallbacks.
- `rune-p0-003` is in progress: native storage regression tests now cover persisted session save/load, settings reset clearing, and corrupt JSON recovery, with `docs/release/rune-p0-003-persistence-coverage.md` committed in v6.
- `zyra-p0-002` monitor pass on 2026-04-26 added `npm run health:live` in v6 and documented it at `docs/release/zyra-p0-002-live-health-check.md`; the live deployment returns HTTP 200, passes the shell-marker check, and headless-renders the intro route in Chromium; current local v6 `typecheck`, Jest (57/57 in 19 suites), and Expo web export also passed.
- `rune-p0-004` is complete: `eas.json` now defines preview, iOS simulator, internal, store, and production build profiles, and `docs/release/rune-p0-004-eas-profiles.md` documents bundle IDs, scheme, EAS project metadata, env policy, and EAS config validation commands.
- `oracle-p0-001` is complete: v6 now has `engine/economy-replay.ts`, a focused `npm run replay:economy` command, and `docs/release/oracle-p0-001-economy-replay-harness.md` documenting the 1000-seed deterministic replay baseline with 1000 profitable sessions, 81 raid sessions, 0 soft locks, 0 impossible states, median PnL 48.88, median max Heat 60, and median first profitable sell tick 4.
- `oracle-p0-002` is complete: v6 now has `engine/launch-tuning.ts`, `engine/__tests__/launch-tuning.test.ts`, a focused `npm run tuning:launch` command, and `docs/release/oracle-p0-002-launch-tuning.md` documenting the accepted launch survival, Heat, raid, and reward bands. The local baseline reports 1000/1000 profitable sessions, 81 raid sessions, 0 soft locks, 0 impossible states, median PnL 48.88, median max Heat 60, and zero low/medium/high-risk strategy issues.
- `ghost-p0-001` is complete: v6 now has `docs/release/ghost-p0-001-release-authority.md` documenting release blockers, direct-to-main automation criteria, and Ghost Gate A/B/C sign-off rules.
- `ghost-p0-002` is complete: v6 now has `docs/release/ghost-p0-002-architecture-risk-audit.md` documenting Expo dependency advisories, storage and authority boundaries, EAS Node alignment to Expo SDK 52, the top 10 App Store submission risks, owners, and required evidence.
- `kite-p0-001` is complete: v6 keeps `LocalAuthority` as the default authority, selects `SupabaseAuthority` only when the authority feature flag and public config are present, supports an explicit authority-off override for client-only Supabase use, and documents RLS/schema requirements in `docs/release/kite-p0-001-supabase-authority.md`.
- `axiom-p0-002` is complete: v6 now has `docs/release/axiom-p0-002-regression-checklist.md` documenting the store-submission regression test suite as three checklists - first-session (intro through first profitable sell), trading (buy/sell math, Energy/Heat, persistence, routes, cross-surface), and store metadata (bundle/identity, visual assets, copy, age rating/policy, account recovery, build artifacts) - with cross-references to the rune, oracle, and kite release notes; current local v6 `typecheck`, Jest (57/57 in 19 suites), and `npx expo export --platform web` pass.
- `nyx-p0-001` is complete: v6 now has `docs/release/nyx-p0-001-first-session-loop.md`, a live `FirstSessionCue` on home/terminal, a manual `WAIT MARKET TICK` terminal action, and tests proving the starter `VBLM` first-profit loop closes within the guided tick window.
- `nyx-p0-002` is complete: v6 now has `engine/demo-pressure.ts`, `engine/__tests__/demo-pressure.test.ts`, and `docs/release/nyx-p0-002-demo-pressure-tuning.md` proving three 60-tick demo strategies stay viable with zero issues, positive realized PnL, visible Watchlist/Priority Target escalation, and courier risk scaling.
- `zoro-p0-001` is complete: v6 now has `docs/release/zoro-p0-001-first-journey-creative-pass.md` approving the first 10-minute Gate A journey with follow-ups for Vex, Palette, Reel, and Axiom.
- `vex-p0-001` is complete: v6 now has `docs/release/vex-p0-001-mobile-hud-readability.md`, Superdesign-backed HUD notes, prioritized Energy/Heat/0BOL home metrics, terminal Energy/Heat/Owned/0BOL telemetry, scaled critical labels, and 44-52 px first-trade touch targets. Current local v6 `typecheck`, Jest (59/59 in 20 suites), and Expo web export pass.

## Current Blockers

- iOS and Android runtime validation are still pending.
- Cold-launch native persistence still needs device/simulator validation beyond the storage regression tests.
- SupabaseAuthority is feature-flagged and documented, but a live Supabase project, migrations, and RLS validation are not yet confirmed.
- Apple/Google credentials and the first remote EAS build runs are not yet confirmed.
- Store metadata, privacy copy, screenshots, and preview video are not ready.
- Expo toolchain transitive dependency advisories remain open: `npm audit --omit=dev --audit-level=high` reports 20 production advisories, and the automatic forced fix proposes a breaking Expo change.
- Autonomous direct-to-main release authority is documented; Talon rollback and incident protocol remains pending.
- OpenClaw Mac mini now runs `OpenClaw 2026.4.24`, but a bounded post-fix doctor still timed out after 60 seconds.
- OpenClaw reports 38 skill requirement gaps after `doctor --fix`; Cipher/Talon should decide which ClawdHub/OpenClaw skills are required for v6 execution.
