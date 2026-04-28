# CyberTrader v6 App Store Readiness Task Map

Updated: 2026-04-28 (full autonomy directive active; v6 93096a5 QA smoke hardening pushed and post-push monitor green)

## Mission

Take `CyberTrader-Age-of-Pantheon-v6` from current playable prototype to a polished App Store / Play Store submission-ready game through continuous autonomous AI execution.

- Active game repo: `https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v6`
- Live web deployment: `https://cyber-trader-age-of-pantheon-v6.vercel.app`
- Control plane: this Dev Lab repo

The Dev Lab 3D office is now a completed studio milestone. New work should improve the actual game unless explicitly marked as studio operations. Ghost and Zoro remain founder/persona references, but no human approval is required for normal game, docs, design, asset, automation, or roadmap work.

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
- App icon, splash, screenshots, preview video, age rating notes, privacy copy, and support URL are ready or account/legal-only gaps are logged in `HUMAN_ACTIONS.md`.
- SupabaseAuthority scope is either complete behind a feature flag or explicitly deferred.
- Legal/security notes cover simulated trading, $OBOL naming, wallet flags, and privacy.
- App Store and Play Store internal builds are submitted if credentials/declarations are configured; otherwise agents prepare everything and keep building.

## Owner Map

### Ghost - Lead Developer
- Founder/Lead Developer reference persona for engineering quality, not a manual approval gate.
- Keep release gates, direct-push automation criteria, and App Store risk notes current.
- Let agents execute SDK 54, EAS, Supabase, and release-plan work autonomously unless account-owner credentials or legal declarations are required.
- Record human-only account/legal/payment items in `HUMAN_ACTIONS.md`.

### Zoro - Creative Lead
- Founder/Creative Lead reference persona for taste, not a manual approval gate.
- Let agents continuously improve screenshots, trailers, icons, faction art, OS visuals, tutorial mood, and cyberdeck polish.
- Reject generic-dashboard aesthetics through automated design criteria and QA notes, not human blocking.
- Record human-only taste notes as optional follow-up, never as a ship blocker.

### Game Designer Agent / Nyx
- Tighten first-session flow from intro to first profitable sell.
- Tune Energy, Heat, raid, courier, and bounty pressure for a 10-minute demo.
- Design Phase 2 faction choice and AgentOS unlock requirements.
- Produce player archetypes for first beta tuning.

### UI/UX & Cyberpunk Aesthetic / Vex
- Polish mobile HUD readability and one-hand ergonomics.
- Responsive pass for web, small phone, large phone, and tablet is complete.
- Maintain and extend completed error, empty, offline, and loading states.
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
- Apply and validate prepared Supabase migrations for ledger, positions, player state, and events.
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

Agents must work without human review when all of these are true:

1. The task is in this map or is a directly necessary follow-up.
2. The change is scoped and reversible.
3. The agent pulls before starting.
4. The agent runs relevant checks before pushing.
5. The commit message includes the task ID.
6. The task/status docs are updated in the same commit.

Agents may also create new tasks when they identify a useful improvement that is missing from the board. The game bible guides direction but does not limit creative expansion.

If a task needs a human account owner, legal declaration, paid spend decision, or external credential, the agent must write it to `HUMAN_ACTIONS.md`, log it in Dev Lab, and immediately continue with another unblocked task.

Hard stops:

- Do not force-push.
- Do not commit secrets.
- Do not print API keys in logs.
- Do not perform on-chain or real-money actions.
- Do not delete user data or production data.
- Do not create uncontrolled paid spend.
- Do not treat Ghost/Zoro creative feedback as a release blocker.

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

## Expansion Backlog - Autonomous Game Build

These are the next high-impact tracks for daily visible improvements:

- **PirateOS premium pass**: make the current loop faster, clearer, more animated, and less dashboard-like.
- **AgentOS rank-5 unlock**: faction choice, faction missions, route map, reputation, faction rewards, limit orders, and stronger NPC contracts.
- **PantheonOS rank-20 shell**: Neon Void territory map, shard memory storyline, crew warfare, faction events, seasonal dominance, and territory modifiers.
- **Public interfaces**: add or expand deterministic serializable contracts for `FactionStanding`, `FactionChoice`, `LimitOrder`, `TerritoryNode`, `TerritoryEvent`, `Crew`, `ShardMemory`, and `AuthoritySyncStatus`.
- **SDK/store toolchain**: upgrade toward Expo SDK 54 before store builds, then prove Xcode 26 / iOS 26 SDK and Android target SDK compliance.
- **Daily content growth**: add missions, rivals, market disasters, new commodities, abilities, cinematic beats, transition polish, and store-media improvements.

## Current Progress

- `rune-p0-001` is complete: v6 `npm install`, `npm run typecheck`, `npm test -- --runInBand`, and `npx expo export --platform web` pass locally on 2026-04-26.
- The v6 audit route map and dependency notes are logged in the v6 repo at `docs/release/rune-p0-001-technical-audit.md`.
- The root v6 typecheck now targets the Expo app and excludes the standalone Remotion `cinematics/` package, which has its own package and TypeScript config.
- `rune-p0-002` is complete: protected player routes now recover after hydration when deep-linked without a local player, the `/` entry route uses shared phase-to-route logic, and menu/Android back actions use safe empty-stack fallbacks.
- `rune-p0-003` is in progress: native storage regression tests now cover persisted session save/load, settings reset clearing, and corrupt JSON recovery, with `docs/release/rune-p0-003-persistence-coverage.md` committed in v6.
- `zyra-p0-002` monitor pass on 2026-04-26 added `npm run health:live` in v6 and documented it at `docs/release/zyra-p0-002-live-health-check.md`; the live deployment returns HTTP 200, passes the shell-marker check, and headless-renders the live mobile web shell in Chromium with title `CyberTrader`, visible `AG3NT_0S//pIRAT3` boot text, and no console/page errors. A follow-up monitor pass pushed `884e4b1`, making `npm run qa:responsive` self-contained by building the web export before Playwright; current local v6 `health:live`, `typecheck`, and Jest (59/59 in 20 suites) pass.
- `rune-p0-004` is complete: `eas.json` now defines preview, iOS simulator, internal, store, and production build profiles, and `docs/release/rune-p0-004-eas-profiles.md` documents bundle IDs, scheme, EAS project metadata, env policy, and EAS config validation commands.
- `rune-p1-005` is complete: v6 commit `9c0559e` adds local runtime diagnostics hooks for web/native exceptions, unhandled promise rejections, and console errors; diagnostic reports redact credential-shaped values and expose QA session context through `globalThis.__CYBERTRADER_QA_DIAGNOSTICS__` without storing raw handles or player ids. Full `npm run ship:check` passed with 123/123 Jest tests in 28 suites and Expo web export.
- `oracle-p0-001` is complete: v6 now has `engine/economy-replay.ts`, a focused `npm run replay:economy` command, and `docs/release/oracle-p0-001-economy-replay-harness.md` documenting the 1000-seed deterministic replay baseline with 1000 profitable sessions, 81 raid sessions, 0 soft locks, 0 impossible states, median PnL 48.88, median max Heat 60, and median first profitable sell tick 4.
- `oracle-p0-002` is complete: v6 now has `engine/launch-tuning.ts`, `engine/__tests__/launch-tuning.test.ts`, a focused `npm run tuning:launch` command, and `docs/release/oracle-p0-002-launch-tuning.md` documenting the accepted launch survival, Heat, raid, and reward bands. The local baseline reports 1000/1000 profitable sessions, 81 raid sessions, 0 soft locks, 0 impossible states, median PnL 48.88, median max Heat 60, and zero low/medium/high-risk strategy issues.
- `oracle-p0-003` is complete: v6 now has `engine/economy-stress.ts`, `engine/__tests__/economy-stress.test.ts`, a focused `npm run stress:economy` command, and `docs/release/oracle-p0-003-economy-stress.md` proving zero impossible states and zero negative balances across 200 seeds each for four adversarial starting conditions: 500 0BOL floor, Heat=75 Priority Target entry, 300-second Energy floor, and Heat=88 near-ceiling entry. Full suite 73/73 in 23 suites.
- `ghost-p0-001` is complete and superseded by the 2026-04-28 autonomy directive: v6 now has `docs/release/ghost-p0-001-release-authority.md` documenting release blockers and direct-to-main automation criteria; Ghost Gate A/B/C sign-off language is historical and no longer blocks normal implementation.
- `ghost-p0-002` is complete: v6 now has `docs/release/ghost-p0-002-architecture-risk-audit.md` documenting Expo dependency advisories, storage and authority boundaries, EAS Node alignment to Expo SDK 52, the top 10 App Store submission risks, owners, and required evidence.
- `kite-p0-001` is complete: v6 keeps `LocalAuthority` as the default authority, selects `SupabaseAuthority` only when the authority feature flag and public config are present, supports an explicit authority-off override for client-only Supabase use, and documents RLS/schema requirements in `docs/release/kite-p0-001-supabase-authority.md`.
- `kite-p0-002` is complete: v6 now has `authority/launch-identity.ts`, focused Jest coverage, and `docs/release/kite-p0-002-launch-identity-recovery.md` defining the LocalAuthority-only launch identity model, no-wallet/no-backend/no-payment reviewer notes, handle validation rules, on-device recovery limits, and privacy copy implications. Validation: `npm run ship:check` passed with safety scan, typecheck, 139/139 Jest tests in 30 suites, and Expo web export.
- `kite-p1-004` is complete: v6 commit `c895318` adds `authority/store-safety.ts`, `authority/__tests__/store-safety.test.ts`, shared Legal/Settings reviewer-safe copy, prohibited-claims checks for real-money, investment, regulated-market, prize, and signing-material language, and a release note at `docs/release/kite-p1-004-store-safe-boundaries.md`. Validation: `npm run ship:check` passed with safety scan, typecheck, 144/144 Jest tests in 31 suites, and Expo web export.
- `kite-p1-003` is complete: v6 commit `15308c9` adds `supabase/migrations/20260428183000_kite_p1_003_authority_schema.sql`, a matching rollback script, `authority/__tests__/supabase-migrations.test.ts`, and `docs/release/kite-p1-003-supabase-migrations.md`. The migration covers players, resources, commodities, market prices/news, positions, ledger entries, trades, and authority events; seeds the launch commodity catalog; enables owner-bound RLS; and routes XP/resource writes through RPCs. Validation: `npm run ship:check` passed with safety scan, typecheck, 149/149 Jest tests in 32 suites, and Expo web export after `15308c9` was pushed to `origin/main`.
- `axiom-p0-002` is complete: v6 now has `docs/release/axiom-p0-002-regression-checklist.md` documenting the store-submission regression test suite as three checklists - first-session (intro through first profitable sell), trading (buy/sell math, Energy/Heat, persistence, routes, cross-surface), and store metadata (bundle/identity, visual assets, copy, age rating/policy, account recovery, build artifacts) - with cross-references to the rune, oracle, and kite release notes; current local v6 `typecheck`, Jest (59/59 in 20 suites), and `npx expo export --platform web` pass.
- `axiom-p1-003` is complete: v6 commit `3e3f0ca` adds `npm run perf:budgets`, `scripts/check-performance-budgets.mjs`, and `docs/release/axiom-p1-003-performance-budgets.md`. The web budget check covers total export size, main JS raw/gzip, intro cinematic media, and optimized active art; native cold-start, warm resume, interaction latency, memory, and runtime-error budgets are documented for the pending `axiom-p0-001` simulator/emulator pass.
- `axiom-p1-004` is complete: v6 now has `npm run qa:smoke`, which builds the web export and runs a CI-friendly Playwright path from `/intro` through local login, tutorial, terminal entry, buy, market tick, sell, inventory, and settings/local-mode disclosure. Commit `98f1623` adds the smoke route and release note; `daa33e9` hardens visible-text assertions, post-execute responsive polling, and runtime-error filtering; `ff7b7c3` hardens the local static server's SPA fallback for direct `/menu/*` checks; `93096a5` hardens direct inventory/settings readiness and replaces the stale Settings marker with current LocalAuthority recovery copy. Current validation: `npm run safety:autonomous` passed; `npm run qa:smoke` 1/1 passed; `npm run qa:axiom:live` 1/1 passed; post-push `npm run regression:monitor` passed typecheck, Jest, and `health:live`.
- `axiom-p1-003` is complete: v6 commit `3e3f0ca` adds `npm run perf:budgets`, `scripts/check-performance-budgets.mjs`, and `docs/release/axiom-p1-003-performance-budgets.md`. The web-export budget gate currently passes with a 24.45 MiB total export, 2.12 MiB raw main JS, 538.9 KiB gzipped main JS, 21.24 MiB intro media, and 1.07 MiB optimized active art. Gate B native budgets are numeric for cold launch, warm resume, trade feedback, route transitions, memory, and raw runtime errors, with owners assigned for every miss.
- `nyx-p0-001` is complete: v6 now has `docs/release/nyx-p0-001-first-session-loop.md`, a live `FirstSessionCue` on home/terminal, a manual `WAIT MARKET TICK` terminal action, and tests proving the starter `VBLM` first-profit loop closes within the guided tick window.
- `nyx-p0-002` is complete: v6 now has `engine/demo-pressure.ts`, `engine/__tests__/demo-pressure.test.ts`, and `docs/release/nyx-p0-002-demo-pressure-tuning.md` proving three 60-tick demo strategies stay viable with zero issues, positive realized PnL, visible Watchlist/Priority Target escalation, and courier risk scaling.
- `zoro-p0-001` is complete: v6 now has `docs/release/zoro-p0-001-first-journey-creative-pass.md` approving the first 10-minute Gate A journey with follow-ups for Vex, Palette, Reel, and Axiom.
- `vex-p0-001` is complete: v6 now has `docs/release/vex-p0-001-mobile-hud-readability.md`, Superdesign-backed HUD notes, prioritized Energy/Heat/0BOL home metrics, terminal Energy/Heat/Owned/0BOL telemetry, scaled critical labels, and 44-52 px first-trade touch targets. Current local v6 `typecheck`, Jest (59/59 in 20 suites), and Expo web export pass.
- `vex-p0-002` is complete: v6 now has `docs/release/vex-p0-002-responsive-viewport-pass.md`, committed home/terminal capture evidence for web desktop, small phone, large phone, and tablet portrait, a pinned Playwright `npm run qa:responsive` command, and a web-shell background fix. Current local v6 `typecheck`, Jest (59/59 in 20 suites), Expo web export, and responsive QA pass; `qa:responsive` now builds the export itself before serving `dist/`.
- `talon-p0-002` is complete: v6 now has `scripts/check-autonomous-safety.mjs`, `npm run safety:autonomous`, `npm run ship:check`, and `docs/release/talon-p0-002-autonomous-safety-rails.md`. The preflight reports only file paths and rule names while blocking secret files, concrete secret assignments, force-push/destructive reset commands, remote EAS build/submit commands, and on-chain transaction actions.
- `vex-p1-003` is complete: v6 now has `components/system-state-panel.tsx`, safe system messages, route-recovery loading treatment, terminal offline/locked panels, empty-state panels for positions/news/notifications, Settings local-mode disclosure, and `docs/release/vex-p1-003-system-states.md`. Current local safety scan over `884e4b1..HEAD`, `typecheck`, Jest (64/64 in 22 suites), and Expo web export pass.
- `reel-p0-001` is complete: v6 now has `docs/release/reel-p0-001-app-store-preview-storyboard.md`, a 30-second App Store preview beat sheet, named capture routes, store-safety rules, staged data requirements, and SuperDesign trailer capture board `https://p.superdesign.dev/draft/e900723e-1c80-4265-8221-b9c9fe7d15b2`. Zoro feedback is optional, not a blocker.
- `cipher-p0-001` is complete: v6 now has `docs/release/cipher-p0-001-store-submission-requirements.md`, official Apple/Google/Android/Expo source links, Xcode 26 / iOS 26 SDK upload requirements, Google Play API 35 target requirements, Expo SDK 52 target-SDK risk notes, and an updated Axiom store-submission checklist.
- `palette-p0-001` is complete: v6 now has `docs/release/palette-p0-001-asset-audit.md` plus refreshed `.superdesign` context documenting current commodity, Eidolon, cinematic, legacy reference, Remotion, icon/splash, and responsive-capture assets. No low-resolution active images were found; Dev Lab `docs/provenance-report.md` now records source-provenance review evidence, while final store media still needs the `zara-p1-005` script workflow and account-owner declarations if required.
- `cipher-p0-002` is complete: v6 now has `docs/release/cipher-p0-002-policy-risk-matrix.md`, a policy matrix for LocalAuthority, SupabaseAuthority, `0BOL`/`$OBOL`, wallet, simulated trading, gambling/prize, privacy, Data Safety, and age-rating risks, plus required policy copy and legal escalation triggers.
- `talon-p1-003` is complete: v6 now has `docs/release/talon-p1-003-rollback-incident-protocol.md` covering P0/P1/P2 incident tiers, bad-commit detection signals (health:live non-200, typecheck failure, jest regression, safety-scan hit), Vercel dashboard and CLI rollback, git revert procedure (no force-push), TestFlight/Play/EAS native build rollback (Gate B+), Ghost as the sole release authority escalation contact, autonomous agent obligations (stop-log-revert-document), and a required post-incident note template for `docs/automation-runs/`. Zyra run 20260426T174449Z; typecheck pass, 73/73 Jest in 23 suites, health:live HTTP 200.
- `zara-p1-004` is complete: v6 now has `scripts/optimize-assets.mjs`, `npm run optimize:assets` (audit/report), `npm run optimize:assets:apply` (write optimized copies), `assets/optimized/` with 256×256 copies of all 10 commodity icons and a 384×512 Eidolon shard core, and `docs/release/zara-p1-004-asset-optimization-queue.md`. Active app routes (`/home`, `/terminal`, trade-ticket) now use optimized images; commodity bundle weight drops 94% (21.6 MB -> 1.35 MB). Source originals preserved; provenance review is autonomous unless store-owner declarations are required. Zara run 20260426T182226Z; safety scan, typecheck, 73/73 Jest, and Expo web export pass.
- `oracle-p0-004` is complete: v6 now has `engine/economy-endurance.ts`, `engine/__tests__/economy-endurance.test.ts`, `npm run endurance:economy`, and `docs/release/oracle-p0-004-endurance-replay.md`. The 1000-seed × 300-tick endurance harness proves 1000/1000 profitable sessions, 0 impossible states, 0 soft locks, 0 negative balances, median PnL 62.88, balance P50=999861.77 0BOL, median max Heat 84, and 75.6% raid sessions. Determinism confirmed across two independent runs. Full suite: 82/82 tests in 24 suites. Zyra run 20260426T185802Z; typecheck pass.
- `oracle-p0-005` is complete: v6 now has `engine/player-archetypes.ts`, `engine/__tests__/player-archetypes.test.ts`, `npm run archetypes:report`, and `docs/release/oracle-p0-005-player-archetypes.md`. Four beta player archetypes (cautious-grinder, momentum-trader, heat-seeker, speed-runner) each run over 200 seeded sessions × 60 ticks; all pass viability gates (≥70% profitable sessions, 0 impossible states); medianPnl: grinder 6.13 / momentum 33.50 / heat-seeker 33.72 / speed-runner 8.43; tuning insights: VBLM is the ideal first-session commodity (first profit by tick 2), PGAS/ORRS/SNPS is the mid-game upgrade path, FDST/AETH/BLCK confirms high-risk rewards with heat-ceiling exposure at max 68. Full suite: 92/92 in 25 suites; determinism confirmed. Zara run 20260426T193840Z.
- `oracle-p0-006` is complete: v6 now has `engine/beta-tuning.ts`, `engine/__tests__/beta-tuning.test.ts`, `npm run tuning:beta`, and `docs/release/oracle-p0-006-beta-tuning.md`. Targeted parameter adjustments improve the three weakest archetypes from oracle-p0-005 baseline: cautious-grinder VBLM qty 10→15 and profitTargetPct 0.003→0.005 (medianPnl 6.13 was too low for the new-player on-ramp); heat-seeker profitTargetPct 0.012→0.010 (fixes 1/200 non-profitable edge case); speed-runner quantities [5,5,5]→[8,8,8] (60% position increase amplifies frequency advantage over 22 trades per session); momentum-trader unchanged. All four tuned archetypes pass viability gates (≥70% profitable sessions, 0 impossible states). Full suite: 109/109 tests in 26 suites. Zara run 20260426T205541Z.
- `talon-p1-004` is complete: v6 now has `scripts/regression-monitor.mjs`, `npm run regression:check` (force mode — always runs suite), and `npm run regression:monitor` (skip-if-no-new-commits mode). The monitor fetches `origin/main`, compares against `.git/regression-state.json`, and if new commits are found runs `npm run typecheck`, `npm test -- --runInBand --forceExit`, and `npm run health:live`; results are printed as JSON and state is persisted. `scripts/launchd/com.cybertrader.v6.regression-monitor.plist.template` provides a ready-to-install Mac mini LaunchAgent on a 15-minute interval. Force mode: typecheck clean, 109/109 jest in 26 suites, health:live HTTP 200 Vercel HIT — OK. Skip-mode confirmed on second invocation. Zyra run 20260426T222020Z.
- `palette-p1-002` is complete: v6 now has `assets/brand/icon.png` (1024×1024), `assets/brand/adaptive-icon.png` (1024×1024 RGBA transparent), `assets/brand/splash.png` (1284×2778 portrait), and `assets/brand/favicon.png` (64×64), plus `scripts/generate-brand-assets.py` and `npm run generate:brand` for repeatable regeneration. `app.json` now wires `expo.icon`, `splash.image`, `ios.icon`, `android.adaptiveIcon.foregroundImage`, and `web.favicon`. All assets are internally generated by Palette/Zara via Python Pillow on 2026-04-26: no external stock art, licensed images, or third-party AI image services used; agents may keep polishing these assets autonomously. Full suite: 109/109 tests in 26 suites; typecheck clean; Expo web export clean. Zara run 20260426T214508Z.
- `hydra-p0-001` is complete: v6 now has `engine/market-swarm.ts`, `engine/__tests__/market-swarm.test.ts`, `npm run swarm:market`, and `docs/release/hydra-p0-001-market-swarm-scenarios.md`. The harness defines four deterministic 20-agent launch cohorts (`balanced-beta`, `novice-onramp`, `risk-spike`, `speedrun-race`) using the `oracle-p0-006` tuned archetypes. Each scenario runs 800 synthetic sessions with 100% profitable sessions, 0 no-trade sessions, and 0 impossible states; `risk-spike` is a Heat watch scenario at weighted median max Heat 51.15. Full v6 `npm run ship:check` passes with 118/118 tests in 27 suites and Expo web export. Codex run 20260427T140413Z.
- `hydra-p1-002` is complete: v6 commit `2957a6a` adds `engine/retention-scenarios.ts`, `engine/__tests__/retention-scenarios.test.ts`, `npm run retention:beta`, and `docs/release/hydra-p1-002-retention-churn-scenarios.md`. The harness defines five first-20-player retention personas and four deterministic beta cohorts. `npm run retention:beta` passes with 200 synthetic sessions per scenario, 0 impossible states, estimated D1 return from 71.0% to 76.9%, and churn triggers/recommendations for Nyx, Oracle, and Vex. Full v6 `npm run ship:check` passes with safety scan, typecheck, 133/133 Jest tests in 29 suites, and Expo web export.
- `zyra-p1-004` live web QA remains complete and was hardened on 2026-04-28: v6 commit `5481191` updates the live `qa:axiom:live` smoke to wait for DOM content plus visible CyberTrader boot-shell markers instead of `networkidle`, which timed out even though the Vercel shell had already rendered; `d5a0a83` widens that readiness timeout after the Rune diagnostics merge; `93096a5` hardens the local smoke's direct inventory/settings route readiness and current LocalAuthority recovery marker. Current monitor validation on `93096a5` at 2026-04-28T21:56:10Z: `npm run qa:smoke` 1/1 passed, `npm run qa:axiom:live` 1/1 passed, and post-push `npm run regression:monitor` passed typecheck, Jest, and `health:live`.
- `palette-p1-003` is complete: v6 commit `2d1d03c` replaces the placeholder screenshot generator with a real Playwright capture utility, builds the web export before capture, serves `dist/`, walks a local demo session, validates route markers/browser errors, and commits six 1242 x 2688 PNG captures under `assets/screenshots/` for home, terminal, market, missions, inventory, and profile; follow-up `02ea079` records the SuperDesign capture context in `.superdesign/design-system.md` with draft `https://p.superdesign.dev/draft/b11d6241-7779-4b80-bffb-846467843d92`. Current monitor validation: `npm run capture:screenshots`, `npm run safety:autonomous`, `npm run typecheck`, `npm test -- --runInBand` (118/118 tests in 27 suites), `npm run health:live`, and `npm run qa:axiom:live` pass.
- `axiom-p1-004` is complete: v6 commits `98f1623`, `daa33e9`, `ff7b7c3`, and `93096a5` add `npm run qa:smoke` plus a focused Playwright smoke path for intro, login, buy, sell, inventory, and settings/local identity recovery. The route writes actionable diagnostics, rejects runtime/browser errors, and is hardened against static-shell readiness races. Current validation: `npm run qa:smoke`, `npm run qa:axiom:live`, and post-push `npm run regression:monitor` passed.
- `compass-p0-002` is complete: v6 GitHub issues [#2](https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v6/issues/2)-[#6](https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v6/issues/6) batch the active P0/P1 task map into native QA/build evidence, store media/provenance, authority/policy decisions, retention simulations, and automation/run-ledger operations. Owner and priority mapping is recorded in the issue bodies; the repo currently exposes only default GitHub labels.
- `zara-p1-005` is complete: v6 commit `2549e8d` adds `npm run provenance:assets`, `npm run provenance:assets:check`, recursive inventory scanning, and 37-asset `assets/provenance.json` coverage; follow-up commit `a065fd3` aligns store-media clearance language with the full-autonomy policy. Validation: `npm run provenance:assets:check` and `npm run ship:check` passed with 139/139 Jest tests in 30 suites plus Expo web export.
- `kite-p0-002` is complete: v6 commit `747ff72` adds launch identity recovery logic, tests, legal/settings copy updates, and SuperDesign context so first launch stays wallet-free while recovery limitations are explicit.

## Current Blockers

- iOS and Android runtime validation are still pending.
- This Codex host cannot produce native runtime evidence: `xcodebuild` points at Command Line Tools instead of full Xcode, `simctl` is unavailable, and Android `emulator`/`adb` are not installed.
- Cold-launch native persistence still needs device/simulator validation beyond the storage regression tests.
- SupabaseAuthority is feature-flagged and its migration/RPC baseline is committed, but live Supabase project application and RLS validation are not yet confirmed.
- Apple/Google credentials and the first remote EAS build runs are not yet confirmed.
- iOS store-candidate uploads after 2026-04-28 must prove Xcode 26 / iOS 26 SDK build output.
- Android store-candidate artifacts must prove `targetSdkVersion >= 35`; Expo SDK 52 defaults to target SDK 34 unless the team upgrades or verifies an override.
- Store metadata, public privacy policy, final preview video, account-recovery copy, and final store declarations are not ready. These are no longer implementation blockers: agents should prepare everything possible, log account/legal-only needs in `HUMAN_ACTIONS.md`, and keep shipping v6 improvements. Reel's preview storyboard, Palette's current-asset audit, Cipher's policy matrix, placeholder icon/splash art (`palette-p1-002`), generated screenshot captures (`palette-p1-003`), Dev Lab `docs/provenance-report.md`, and the v6 `zara-p1-005` provenance inventory/check workflow are ready inputs.
- Expo toolchain transitive dependency advisories remain open: `npm audit --omit=dev --audit-level=high` reports 20 production advisories, and the automatic forced fix proposes a breaking Expo change.
- Autonomous direct-to-main release authority, local safety preflight, rollback/incident protocol (talon-p1-003), and automated post-push regression detection (talon-p1-004) are all complete; next automation gate is Mac mini launchd installation of the regression monitor (`scripts/launchd/com.cybertrader.v6.regression-monitor.plist.template`) and optional webhook-based sub-minute detection (talon-p1-005). (complete)
- OpenClaw Mac mini now runs `OpenClaw 2026.4.24` with Zara/Zyra on external `launchd` jobs; OpenAI generation is currently quota-limited and falls through to Claude Code.
- A bounded post-fix OpenClaw doctor still timed out after 60 seconds.
- OpenClaw reports 38 skill requirement gaps after `doctor --fix`; Cipher/Talon should decide which ClawdHub/OpenClaw skills are required for v6 execution.
