# Roadmap - Dev Lab Control Plane and CyberTrader v6

Updated: 2026-04-28

## Reality Check

The Dev Lab 3D office phase is complete. The Dev Lab is now the command center where Ghost, Zoro, the AI Council, Zara, Zyra, and Codex automations coordinate the actual game work.

The operating model is now fully autonomous. Ghost and Zoro remain founder/persona references, but they are not approval gates for ordinary work. The AI Council, Codex automations, Claude/Codex runners, Zara, and Zyra may choose tasks, design features, expand lore, implement code, test, push, update Dev Lab, and repeat continuously. Human-only account, legal, credential, or budget items go to [`HUMAN_ACTIONS.md`](../HUMAN_ACTIONS.md) and never stop the rest of the build.

The active game is:

```text
https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v6
https://cyber-trader-age-of-pantheon-v6.vercel.app
```

v6 already has the core playable loop: intro/login, LocalAuthority trades, ledger, inventory, XP/rank, locations, travel, heat/raids, couriers, news, flash events, NPC missions, district states, streaks, daily challenges, bounty, and away report.

The `rune-p0-001` technical audit is complete as of 2026-04-26: install, typecheck, tests, and Expo web export are green locally, with Expo toolchain dependency advisories logged for planned remediation. The `rune-p0-002` route hardening pass is also complete: protected routes recover after hydration, menu back actions have safe fallbacks, and Android hardware back returns safely from menu/terminal screens. The `rune-p0-003` persistence reliability pass is in progress, with storage regression coverage now verifying native save/load, reset clearing, and corrupt JSON recovery. The `rune-p0-004` EAS profile pass is complete, `rune-p1-005` adds local crash/log capture hooks and QA diagnostics export context, `oracle-p0-001` now provides a deterministic 1000-seed economy replay harness, `oracle-p0-002` locks launch survival, Heat, raid, and reward bands with zero issues, `ghost-p0-001` documents release blockers and direct-push criteria; older Gate A/B/C language is superseded by full autonomy, `ghost-p0-002` assigns the top App Store architecture risks to owners with required evidence and aligns EAS Node to Expo SDK 52, `kite-p0-001` has SupabaseAuthority behind a tested feature-flag boundary, `kite-p0-002` defines the LocalAuthority launch identity and recovery model, `kite-p1-003` adds deterministic Supabase migration and rollback SQL plus RPC write gates for the future flagged authority path, `kite-p1-004` enforces store-safe wallet/token/non-custodial copy boundaries, `axiom-p0-002` delivers the store-submission regression checklist (first-session, trading, store metadata) cross-linked to the rune/oracle/kite release notes, `axiom-p1-003` defines enforced web-export budgets plus numeric native Gate B budgets, `axiom-p1-004` adds the CI-friendly intro/login/buy/sell/inventory/settings player smoke route, `nyx-p0-001` tightens the live first-session loop with home/terminal guidance, manual market ticks, and starter-profit tests, `nyx-p0-002` codifies 10-minute starter, route-runner, and contraband pressure bands, `zoro-p0-001` approves the first 10-minute Gate A journey with follow-up polish assigned, `vex-p0-001` improves mobile HUD readability and one-hand trade controls, `vex-p0-002` adds exported-web responsive viewport captures and self-contained Playwright QA across web, small phone, large phone, and tablet, `vex-p1-003` adds App Store-safe loading/empty/offline/error states, `talon-p0-002` adds the autonomous safety preflight and full `ship:check` command, `zyra-p0-002` now has a repeatable live deployment shell-marker health command, `reel-p0-001` defines the App Store preview storyboard, capture routes, store-safety rules, staged data needs, and autonomous preview iteration policy, `cipher-p0-001` cites current Apple/Google/Expo submission requirements while binding the Xcode 26 / iOS 26 SDK and Android API 35 target gates into the Axiom checklist, `palette-p0-001` audits current commodity, Eidolon, cinematic, legacy reference, Remotion, icon/splash, and capture-evidence assets for resolution, ownership notes, and screenshot safety, `cipher-p0-002` defines the privacy, token, simulated-trading, and age-rating policy risk matrix, `hydra-p0-001` adds deterministic market-swarm scenarios for balanced beta, novice onramp, contraband risk-spike, and speedrun race cohorts, and `hydra-p1-002` adds first-20-player retention/churn scenarios. The next native gate is running the first simulator/emulator builds against the Axiom checklist with those store-toolchain proofs included.

The 2026-04-28 Codex monitor pass pushed v6 commit `5481191` for `zyra-p1-004`, hardening the live Axiom smoke by waiting for DOM content and visible CyberTrader boot-shell markers instead of `networkidle`; `d5a0a83` widens that readiness timeout after the diagnostics merge; `98f1623` adds the `axiom-p1-004` player smoke route; `daa33e9` hardens Axiom regression assertions; `ff7b7c3` hardens local static fallback for direct menu routes; `93096a5` hardens direct inventory/settings readiness and aligns the Settings assertion with current LocalAuthority recovery copy. Follow-up v6 commits `2d1d03c` and `02ea079` completed `palette-p1-003` screenshot-safe visual state presets with a real Playwright capture utility, six generated 1242x2688 route captures, and refreshed SuperDesign context. Commit `9c0559e` completed `rune-p1-005` crash/log capture hooks with safe redaction and a local QA diagnostics bridge. Commit `3e3f0ca` completed `axiom-p1-003` with `npm run perf:budgets` and numeric cold-start, memory, bundle-size, and interaction-latency budgets. Commit `2957a6a` completed `hydra-p1-002` synthetic retention/churn scenarios. Commit `c895318` completed `kite-p1-004` with a shared store-safety guard, Legal/Settings copy wiring, and wallet flag tests. Commit `15308c9` completed `kite-p1-003` with deterministic Supabase migration/rollback SQL, RPC write gates, and migration guard tests, and is now followed by v6 QA hardening commit `93096a5` on `origin/main`. `compass-p0-002` created v6 GitHub issue batches [#2](https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v6/issues/2)-[#6](https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v6/issues/6) for active P0/P1 readiness work. Dev Lab `docs/provenance-report.md` records source-provenance review evidence, v6 `2549e8d` completes the repeatable 37-asset provenance workflow, v6 `747ff72` completes launch identity recovery, and v6 `a065fd3` aligns store-media clearance with the full-autonomy policy. The 2026-04-28T21:56Z monitor checked `93096a5`: `npm run qa:smoke` passed 1/1, live health returned HTTP 200 with Vercel HIT, `qa:axiom:live` passed 1/1, and post-push `npm run regression:monitor` passed typecheck, Jest, and `health:live`. Current validation is green: `npm run perf:budgets`, `npm run health:live`, `npm run qa:axiom:live`, `npm run qa:smoke`, `npm run regression:monitor`, `npm run capture:screenshots`, `npm run retention:beta`, `npm run provenance:assets:check`, focused Supabase migration guard tests, `npm run ship:check` with 149/149 Jest tests in 32 suites, and `npm run build:web`.

The 2026-04-28 screenshot preset pass pushed v6 commits `2d1d03c` and `02ea079` for `palette-p1-003`: six real 1242 x 2688 PNG captures are staged for home, terminal, market, missions, inventory, and profile; `npm run capture:screenshots` now builds Expo web, serves `dist/`, completes local onboarding, captures the preset routes with Playwright, and rejects missing route markers, placeholder/tiny/wrong-dimension images, or browser errors. The SuperDesign capture context is synced at `https://p.superdesign.dev/draft/b11d6241-7779-4b80-bffb-846467843d92`. Agents may keep improving store screenshots autonomously; Zoro feedback is optional and non-blocking.

The next milestone is **App Store / Play Store submission readiness**, not more Dev Lab office work.

## Product Direction - Three OS Acts

The autonomous team should evolve v6 into a mobile MMORPG-lite cyberdeck game:

1. **PirateOS** - polish the current first 10-minute trading loop until it feels premium, fast, animated, and addictive.
2. **AgentOS** - rank-5 unlock with factions, faction missions, route map, reputation, limit orders, and stronger NPC contracts.
3. **PantheonOS** - rank-20 late-game shell with Neon Void territory map, shard memory storyline, crew warfare, faction events, seasonal dominance, and territory modifiers.

The game bible is a guide. Agents may invent new missions, factions, commodities, enemy systems, abilities, levels, cinematics, and assets when they improve the game.

## Phase 0 - Foundation (2026-04-19 -> 2026-04-25)

Status: **Complete**

- Dev Lab repo scaffolded.
- AI Council and agent roster created.
- Brand, lore, economy, tech architecture, roadmap, and collaboration docs created.
- v1-v6 prototype history consolidated.

## Phase B - Dev Lab 3D Office (2026-04-21 -> 2026-04-25)

Status: **Complete**

- `/office` rebuilt into the playable metaverse-style command center.
- Founder selection for Ghost/Zoro live.
- 16 agent profiles and OpenClaw Zara/Zyra surfaced.
- Avatar Lab and Floor 3D became support surfaces, not the product roadmap.
- Whiteboard/task/status data now points to v6 as the active game.
- Dev Lab repo PRs/issues cleaned to zero open items.

Remaining Dev Lab work is only control-plane maintenance: task truth, docs, automation, and health monitoring.

## Phase 1 - v6 Reliable Demo (2026-04-26 -> 2026-05-10)

Status: **Active**

Goal: make v6 a reliable, repeatable demo across Web, iOS simulator, and Android emulator.

Required:

- `npm run typecheck` green.
- `npm test -- --runInBand` green.
- `npx expo export --platform web` green.
- Route hardening is complete and follows the completed Rune technical audit.
- Native storage regression coverage exists for save/load, reset clearing, and corrupt data recovery.
- 1000-seed deterministic economy replay harness exists for soft-lock and tuning checks.
- Economy replay reports 0 soft locks and 0 impossible states before tuning patches land.
- Launch tuning bands lock 1000/1000 profitable replay sessions, median max Heat 60, 81 raid sessions, and zero low/medium/high-risk strategy issues.
- 10-minute demo pressure bands prove three viable strategies with visible bounty/courier risk escalation.
- Ghost release blockers and direct-push automation criteria are documented; older Gate A/B/C sign-off language is superseded by the 2026-04-28 full-autonomy directive.
- Ghost architecture risk audit assigns the top 10 App Store submission risks to owners with evidence requirements.
- SupabaseAuthority remains off by default and is guarded by explicit flag/config tests before live validation.
- SupabaseAuthority migration and RPC write-boundary baseline exists for players, resources, commodities, market prices/news, positions, ledger entries, trades, and authority events.
- Launch identity and account recovery copy are LocalAuthority-safe: first playable launch needs only a local handle, while no-wallet/no-backend/no-payment reviewer notes and on-device recovery limits are documented.
- Store-safe wallet/token/non-custodial copy boundaries are enforced by shared Legal/Settings copy and prohibited-claims tests.
- First-session loop guidance is live on home/terminal, with manual market ticks and a tested starter profitable sell path.
- Deterministic 10-minute pressure audit exists for starter, medium-risk, and contraband strategies.
- Mobile HUD readability and one-hand first-trade controls meet the first Vex P0 pass.
- Exported-web responsive viewport QA and capture evidence exist for web desktop, small phone, large phone, and tablet portrait.
- App Store-safe loading, empty, offline, and error states exist across route recovery, login validation, terminal locks, empty content, Settings local-mode disclosure, and safe system messages.
- Local crash/log diagnostics capture runtime errors, unhandled promise rejections, and console errors with redacted QA context.
- Autonomous safety preflight and `ship:check` command exist before more direct-push implementation loops.
- `npm run health:live` verifies the live Vercel shell returns HTTP 200 and contains the expected Expo web entry markers.
- `npm run qa:axiom:live` verifies the live Vercel shell renders visible CyberTrader boot markers in Chromium without relying on network idle.
- `npm run qa:smoke` verifies the player-critical intro, login, tutorial, buy, sell, inventory, and settings route on a rebuilt web export.
- `npm run perf:budgets` verifies the web export stays inside the current Axiom budget thresholds.
- Numeric Gate B budgets exist for cold launch, warm resume, memory, trade feedback, route transitions, and runtime-error budget.
- 2026 Apple/Google/Expo submission requirements are cited, including Xcode 26 / iOS 26 SDK and Android API 35 target gates.
- Store-facing asset audit, Dev Lab provenance report, and the `zara-p1-005` generated 37-asset inventory/check workflow exist with resolution, ownership, icon/splash, capture-safety, and source-rights findings.
- Screenshot-safe visual state captures exist for home, terminal, market, missions, inventory, and profile.
- Privacy, token naming, simulated trading, wallet, Data Safety, and age-rating risk matrix exists with required copy and escalation triggers.
- Hydra market-swarm scenarios exist for balanced beta, novice onramp, contraband risk-spike, and speedrun race cohorts; first-20 retention/churn scenarios now provide watch-level D1 risk fixtures across five personas and four beta cohorts.
- v6 GitHub issue batches exist for active P0/P1 readiness work, with owner and priority mapping in the issue bodies.
- Web smoke passes on the live Vercel deployment.
- iOS simulator smoke passes.
- Android emulator smoke passes.
- First 10-minute loop is completable without developer help.
- No blank screens, dead-end routes, raw runtime errors, or clipped critical text.

Primary owners: Ghost, Zoro, Rune, Vex, Nyx, Axiom, Oracle, Kite, Talon.

## Phase 2 - Native Internal Testing (2026-05-11 -> 2026-05-24)

Status: **Upcoming**

Goal: produce TestFlight and Play Internal Testing builds.

Required:

- EAS preview/internal/store profiles are committed.
- Bundle IDs, schemes, app icon, splash, permissions, and env policy documented.
- Xcode 26 / iOS 26 SDK and Android API 35 target compliance proven by native build artifacts.
- Crash/log capture path exists for internal QA attachment; native simulator validation still needs to exercise it.
- Native persistence hydration/recovery.
- SupabaseAuthority live project migration application, RLS validation, and launch-scope decision.
- Store-safe privacy/token/trading language baseline, with public privacy policy and final legal declarations still required.

Primary owners: Ghost, Rune, Kite, Axiom, Cipher, Talon.

## Phase 3 - App Store Candidate (2026-05-25 -> 2026-06-14)

Status: **Upcoming**

Goal: reach a submission-quality candidate.

Required:

- App Store screenshot captures generated and iterated by agents.
- App Store preview storyboard and capture plan.
- Autonomous Palette/Reel/Zara asset polish on icon/splash, screenshot-safe visual states, trailer staging, and source-rights evidence.
- App preview video.
- Store description, keywords, support URL, privacy policy copy, age rating notes.
- Legal/security review of $OBOL naming, simulated trading, wallet flags, and data handling, using the completed Cipher policy matrix and Kite store-safety guard as baseline.
- Final economy tuning.
- Regression suite green.
- AI Council autonomous store-readiness checkpoint.
- Hydra market-swarm and retention/churn outputs remain available as beta economy and D1-risk regression fixtures.

Primary owners: Reel, Palette, Cipher, Kite, Oracle, Compass, Zara, Zyra.

## Phase 4 - Closed Beta (2026-06-15 -> 2026-07-12)

Status: **Upcoming**

Goal: run a small controlled beta and tune from real play.

Required:

- 20-100 invited players.
- Crash-free sessions above 99%.
- D1 retention baseline from the completed first-20 Hydra scenario harness.
- Feedback intake loop.
- Economy and retention-risk reports from Hydra/ElizaOS and real beta data.
- Store listing refinements.

Primary owners: Axiom, Compass, Hydra, Oracle, Ghost, Zoro.

## Phase 5 - Public Launch (target 2026-08)

Status: **Upcoming**

Goal: public launch after store approval and beta hardening. Agents prepare and iterate everything possible; account-owner submission actions are logged in `HUMAN_ACTIONS.md` if credentials/declarations are missing.

Required:

- App Store approval.
- Play Store approval.
- Launch trailer and screenshots live.
- Support/feedback path active.
- First real player cohort monitored.

## Autonomous Team Cadence

- Zara: recurring implementation scout and asset/ops executor through external `launchd` runners.
- Zyra: recurring PM/QA watcher and deployment monitor through external `launchd` runners.
- Codex automations: task truth, status sync, and bounded implementation/QA support.
- AI Council: weekly store-readiness checkpoint.

Autonomous agents must push useful updates directly when checks pass and the change is reversible. Larger migrations may use temporary branches, but agents should merge/squash autonomously when green. No force-push, no secrets, no on-chain actions, no production data deletion, and no uncontrolled paid spend.

## Escalation Triggers

- Store policy/legal uncertainty -> Cipher/Kite log account-owner actions in `HUMAN_ACTIONS.md` and continue unblocked work.
- Build fails twice consecutively -> Axiom/Rune/Talon rollback or fix autonomously.
- Economy tuning causes soft-locks or impossible starts -> Oracle/Nyx/Hydra patch or revert autonomously.
- Autonomous agent pushes a breaking change -> Talon triggers rollback protocol.

## Living Doc Rule

This roadmap changes whenever the product truth changes. Update the matching web data file at `web/src/data/roadmap.ts` in the same commit.
