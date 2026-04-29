# Roadmap - Dev Lab Control Plane and CyberTrader v6

Updated: 2026-04-29

## Reality Check

The Dev Lab 3D office phase is complete. The Dev Lab is now the command center where Ghost, Zoro, the AI Council, Zara, Zyra, and Codex automations coordinate the actual game work.

The operating model is now fully autonomous. Ghost and Zoro remain founder/persona references, but they are not approval gates for ordinary work. The AI Council, Codex automations, Claude/Codex runners, Zara, and Zyra may choose tasks, design features, expand lore, implement code, test, push, update Dev Lab, and repeat continuously. Human-only account, legal, credential, or budget items go to [`HUMAN_ACTIONS.md`](../HUMAN_ACTIONS.md) and never stop the rest of the build.

The active game is:

```text
https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v6
https://cyber-trader-age-of-pantheon-v6.vercel.app
```

v6 already has the core playable loop: intro/login, LocalAuthority trades, ledger, inventory, XP/rank, locations, travel, heat/raids, couriers, news, flash events, NPC missions, district states, streaks, daily challenges, bounty, away report, and the first AgentOS faction unlock surface.

The `rune-p0-001` technical audit is complete as of 2026-04-26: install, typecheck, tests, and Expo web export are green locally, with Expo toolchain dependency advisories logged for planned remediation. The `rune-p0-002` route hardening pass is also complete: protected routes recover after hydration, menu back actions have safe fallbacks, and Android hardware back returns safely from menu/terminal screens. The `rune-p0-003` persistence reliability pass is in progress, with storage regression coverage now verifying native save/load, reset clearing, and corrupt JSON recovery. The `rune-p0-004` EAS profile pass is complete, `rune-p1-005` adds local crash/log capture hooks and QA diagnostics export context, `oracle-p0-001` now provides a deterministic 1000-seed economy replay harness, `oracle-p0-002` locks launch survival, Heat, raid, and reward bands with zero issues, `ghost-p0-001` documents release blockers and direct-push criteria; older Gate A/B/C language is superseded by full autonomy, `ghost-p0-002` assigns the top App Store architecture risks to owners with required evidence and aligns EAS Node to Expo SDK 52, `kite-p0-001` has SupabaseAuthority behind a tested feature-flag boundary, `kite-p0-002` defines the LocalAuthority launch identity and recovery model, `kite-p1-003` adds deterministic Supabase migration and rollback SQL plus RPC write gates for the future flagged authority path, `kite-p1-004` enforces store-safe wallet/token/non-custodial copy boundaries, `axiom-p0-002` delivers the store-submission regression checklist (first-session, trading, store metadata) cross-linked to the rune/oracle/kite release notes, `axiom-p1-003` defines enforced web-export budgets plus numeric native Gate B budgets, `axiom-p1-004` adds the CI-friendly intro/login/buy/sell/inventory/settings player smoke route, `nyx-p0-001` tightens the live first-session loop with home/terminal guidance, manual market ticks, and starter-profit tests, `nyx-p0-002` codifies 10-minute starter, route-runner, and contraband pressure bands, `nyx-p1-002` / `oracle-p1-008` applies Oracle beta tuning to the live strategy guidance, default `VBLM x15` starter lot, Help/NPC hints, GLCH icon map, and SuperDesign-backed cue treatment, `zoro-p0-001` approves the first 10-minute Gate A journey with follow-up polish assigned, `zoro-p0-002` approves the six-shot portrait screenshot direction, Reel preview story spine, and cyberdeck store-page mood, `zoro-p1-004` tightens tutorial/help/Oracle cue copy around the local fictional `VBLM x15` first-session route, `nyx-p1-006` / `oracle-p1-012` adds AgentOS route reward/timer/Heat pressure hooks to generated faction missions, `vex-p0-001` improves mobile HUD readability and one-hand trade controls, `vex-p0-002` adds exported-web responsive viewport captures and self-contained Playwright QA across web, small phone, large phone, and tablet, `vex-p1-003` adds App Store-safe loading/empty/offline/error states, `talon-p0-002` adds the autonomous safety preflight and full `ship:check` command, `zyra-p0-002` now has a repeatable live deployment shell-marker health command, `reel-p0-001` defines the App Store preview storyboard, capture routes, store-safety rules, staged data needs, and autonomous preview iteration policy, `cipher-p0-001` cites current Apple/Google/Expo submission requirements while binding the Xcode 26 / iOS 26 SDK and Android API 35 target gates into the Axiom checklist, `palette-p0-001` audits current commodity, Eidolon, cinematic, legacy reference, Remotion, icon/splash, and capture-evidence assets for resolution, ownership notes, and screenshot safety, `cipher-p0-002` defines the privacy, token, simulated-trading, and age-rating policy risk matrix, `hydra-p0-001` adds deterministic market-swarm scenarios for balanced beta, novice onramp, contraband risk-spike, and speedrun race cohorts, and `hydra-p1-002` adds first-20-player retention/churn scenarios. The next native gate is running the first simulator/emulator builds against the Axiom checklist with those store-toolchain proofs included.

The latest 2026-04-29 Codex autonomous ship loop pushed v6 commit `37e6151` for `nyx-p1-006` / `oracle-p1-012`: AgentOS contract-chain route consequences now affect generated faction missions through deterministic reward multiplier, timer multiplier, and success/failure Heat pressure hooks; `/missions` renders compact route-pressure copy inside the existing contract strip; and LocalAuthority/SupabaseAuthority expose mission pressure application while local mission resolution applies route Heat deltas before normal Heat/bounty feedback. Validation is green: focused faction/mission/local-authority tests, `npm run typecheck`, `npm run ship:check` with 181/181 Jest tests in 37 suites plus Expo web export, `npm run build:web -- --clear`, `npm run qa:axiom` 11/11, and `npm run qa:responsive` 4/4.

The earlier 2026-04-29 Codex autonomous ship loop pushed v6 commit `4a8c078` for `zoro-p1-004`: the active `/tutorial` script now lives in `data/tutorial-copy.ts` with copy tests, the eight tutorial steps teach the local fictional `VBLM x15` buy/wait/sell route directly, and Help Terminal plus Oracle first-session cue copy clarify WAIT/SELL actions while preserving store-safe local-mode boundaries. Validation is green: focused copy/cue/strategy tests, `npm run ship:check` with 180/180 Jest tests in 37 suites plus Expo web export, `npm run qa:smoke`, `npm run build:web -- --clear`, post-push `npm run qa:axiom:live`, and post-push `npm run regression:monitor`.

The latest 2026-04-29 autonomous store-media pass pushed v6 commits `65ad6ce` and `7bf5e38` for `zoro-p0-002` / `zara-p1-005`. The pass approves the current six-shot portrait screenshot direction, Reel preview story spine, and cyberdeck store-page mood; refreshes screenshot capture/provenance to the current 39-asset inventory; and leaves final preview video, native-device captures, public privacy policy, age-rating declarations, and account-owner store submission as Gate C follow-ups. Validation is green: `npm run safety:autonomous`, `npm run typecheck`, `npm run capture:screenshots` with Expo web export, six 1242 x 2688 PNG screenshot dimension checks, `npm run provenance:assets:check`, `npm run ship:check` with 165/165 Jest tests in 34 suites, post-push `npm run regression:monitor`, `npm run qa:axiom:live`, and `npm run perf:budgets` passed on or through `7bf5e38`.

The latest 2026-04-29 Codex autonomous ship loop pushed v6 commits `d751d68` and `1afc137` for `oracle-p1-011` / `vex-p1-004`: `/terminal` keeps the deterministic AgentOS pressure-window preview from `1631381`, applies those windows after location/district/flash modifiers, renders compact pressure-window plus limit-trigger rows, and adds a subordinate LocalAuthority limit-order module that arms, persists, cancels, expires, and resolves orders on manual/background market ticks while rechecking Energy, Heat, 0BOL, holdings, travel, district, and blackout locks. The same pass ships the first core cyberdeck surface polish slice with packet-style section headers, market tape labels, and terminal subsystem framing on `/home` and `/terminal`. Validation is green: `npm run limit-orders:check`, `npm run typecheck`, `npm run ship:check` with 178/178 Jest tests in 36 suites plus Expo web export, `npm run qa:smoke`, `npm run build:web -- --clear`, `npm run qa:axiom` 11/11, `npm run qa:responsive` 4/4, post-push `npm run health:live`, post-push `npm run qa:axiom:live`, and forced post-push `npm run regression:check`.

The earlier 2026-04-29 Codex autonomous ship loop pushed v6 commit `3ab5746` for `nyx-p1-005`, `oracle-p1-010`, and `reel-p1-002`: AgentOS missions now surface faction-specific contract-chain stakes on mission banners and contact rows; the engine exposes deterministic limit-order/fill/faction-pressure contracts for the next terminal command layer; and the cinematic/text intro handoff now has packet metadata, progress rails, and larger mobile-safe skip/enter commands. Validation included focused AgentOS/mission tests, `npm run limit-orders:check`, `npm run typecheck`, the full v6 `npm run ship:check`, `npm run build:web -- --clear`, `npm run qa:smoke`, `npm run health:live`, and `npm run qa:axiom:live`.

The earlier 2026-04-29 AgentOS autonomous pass pushed v6 commits `6b16a8b`, `d165625`, and `7c9b47c` for `nyx-p1-003` / `nyx-p1-004` plus Axiom/provenance hardening. The pass ships deterministic rank-5 faction selection, selectable faction alignment, one free faction switch, persisted `FactionChoice`, LocalAuthority `chooseFaction`, mission-bias hooks, AgentOS progression copy, `/missions` contract gate coverage, and Axiom login-storage hardening. Validation is green: focused faction/mission/local-authority tests, `npm run typecheck`, `npm run ship:check` with 165/165 Jest tests in 34 suites, `npm run build:web -- --clear`, `npm run qa:axiom` 11/11 after browser-session reset hardening, `npm run perf:budgets`, `npm run provenance:assets:check`, `npm run health:live`, `npm run qa:axiom:live`, post-push `npm run regression:monitor` through `d165625`, and force `npm run regression:check` on `7c9b47c` all passed.

The earlier 2026-04-29 autonomous pass pushed v6 commits `68a8f74` and `c73d733` for `oracle-p1-009`, `rune-p0-006`, and the `talon-p1-004` monitor follow-up. The pass aligns the Expo SDK 54 package graph, admits GLCH into the Oracle momentum-trader archetype and beta-tuned mirror, updates retention/swarm handoff copy to `PGAS/GLCH/ORRS/SNPS`, and makes `npm run regression:monitor` persist state through `git rev-parse --git-path regression-state.json` so linked worktrees can run it. Validation is green: `npx expo install --check`, `npm run ship:check` with 157/157 Jest tests in 33 suites, `npm run qa:smoke`, clean-cache web export, post-push `npm run regression:monitor`, and `npm audit --omit=dev --audit-level=high` all passed. Native Xcode 26/iOS 26 and Android API 35 proof remains pending on a provisioned QA host.

The same day also pushed v6 commits `103d680` and `44ae679` for `nyx-p1-002` / `oracle-p1-008`, shipping tuned strategy guidance, `VBLM x15` starter default, Help/NPC hints, metric/cue polish, and GLCH icon coverage. Validation is green: focused strategy/cue/first-loop tests, `npm run typecheck`, `npm run ship:check` with 155/155 Jest tests in 33 suites, `npm run build:web -- --clear`, `npm run qa:smoke`, `npm run qa:responsive`, `npm run qa:axiom:live`, and force `npm run regression:check` all passed. The 2026-04-28 Codex monitor pass pushed v6 commit `5481191` for `zyra-p1-004`, hardening the live Axiom smoke by waiting for DOM content and visible CyberTrader boot-shell markers instead of `networkidle`; `d5a0a83` widens that readiness timeout after the diagnostics merge; `98f1623` adds the `axiom-p1-004` player smoke route; `daa33e9` hardens Axiom regression assertions; `ff7b7c3` hardens local static fallback for direct menu routes; `93096a5` hardens direct inventory/settings readiness and aligns the Settings assertion with current LocalAuthority recovery copy. Follow-up v6 commits `2d1d03c` and `02ea079` completed `palette-p1-003` screenshot-safe visual state presets with a real Playwright capture utility, six generated 1242x2688 route captures, and refreshed SuperDesign context. Commit `9c0559e` completed `rune-p1-005` crash/log capture hooks with safe redaction and a local QA diagnostics bridge. Commit `3e3f0ca` completed `axiom-p1-003` with `npm run perf:budgets` and numeric cold-start, memory, bundle-size, and interaction-latency budgets. Commit `2957a6a` completed `hydra-p1-002` synthetic retention/churn scenarios. Commit `c895318` completed `kite-p1-004` with a shared store-safety guard, Legal/Settings copy wiring, and wallet flag tests. Commit `15308c9` completed `kite-p1-003` with deterministic Supabase migration/rollback SQL, RPC write gates, and migration guard tests. Zara commit `fdd7160` added Obsidian as a rank-7 Eclipse Guild NPC and started the SDK 54 manifest bump; Codex commit `49c1e49` repaired the Expo 54 lockfile, tracked GLCH commodity source/optimized art, refreshed 39-asset provenance, and recorded the Hydra market-swarm planning note; Nyx commit `4522175` documents the GLCH release. `compass-p0-002` created v6 GitHub issue batches [#2](https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v6/issues/2)-[#6](https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v6/issues/6) for active P0/P1 readiness work. Dev Lab `docs/provenance-report.md` records source-provenance review evidence, v6 `2549e8d` completes the repeatable 37-asset provenance workflow, v6 `747ff72` completes launch identity recovery, and v6 `a065fd3` aligns store-media clearance with the full-autonomy policy.

The 2026-04-28 screenshot preset pass pushed v6 commits `2d1d03c` and `02ea079` for `palette-p1-003`: six real 1242 x 2688 PNG captures are staged for home, terminal, market, missions, inventory, and profile; `npm run capture:screenshots` now builds Expo web, serves `dist/`, completes local onboarding, captures the preset routes with Playwright, and rejects missing route markers, placeholder/tiny/wrong-dimension images, or browser errors. The SuperDesign capture context is synced at `https://p.superdesign.dev/draft/b11d6241-7779-4b80-bffb-846467843d92`. Agents may keep improving store screenshots autonomously; Zoro feedback is optional and non-blocking.

The next milestone is **App Store / Play Store submission readiness**, not more Dev Lab office work.

## Product Direction - Three OS Acts

The autonomous team should evolve v6 into a mobile MMORPG-lite cyberdeck game:

1. **PirateOS** - polish the current first 10-minute trading loop until it feels premium, fast, animated, and addictive.
2. **AgentOS** - rank-5 faction choice, one-free-switch allegiance, mission bias, reputation hooks, mission contract chains, deterministic limit-order/faction-pressure engine interfaces, terminal pressure-window previews, persisted local limit-order commands, and route reward/timer/Heat pressure hooks are live; next grow tutorialized stakes and faction-specific mission content depth.
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
- AgentOS rank-5 faction choice has a shipped gate, persistent local authority contract, mission-surface readiness cues, and deterministic faction-biased mission generation.
- AgentOS faction contracts now expose reputation-linked stage, Heat posture, route consequence, and reputation delta on mission surfaces.
- Ghost release blockers and direct-push automation criteria are documented; older Gate A/B/C sign-off language is superseded by the 2026-04-28 full-autonomy directive.
- Ghost architecture risk audit assigns the top 10 App Store submission risks to owners with evidence requirements.
- SupabaseAuthority remains off by default and is guarded by explicit flag/config tests before live validation.
- SupabaseAuthority migration and RPC write-boundary baseline exists for players, resources, commodities, market prices/news, positions, ledger entries, trades, and authority events.
- Launch identity and account recovery copy are LocalAuthority-safe: first playable launch needs only a local handle, while no-wallet/no-backend/no-payment reviewer notes and on-device recovery limits are documented.
- Store-safe wallet/token/non-custodial copy boundaries are enforced by shared Legal/Settings copy and prohibited-claims tests.
- AgentOS rank-5 faction gate and selection loop are live with persisted local allegiance, one free switch, and faction-biased missions.
- First-session loop guidance is live on home/terminal, with manual market ticks and a tested starter profitable sell path.
- Oracle beta tuning is live in the first-session strategy cue, Help terminal, NPC hints, and VBLM x15 starter default.
- Tutorial and Help copy explicitly teach the local fictional VBLM x15 buy/wait/sell route and avoid generic onboarding filler.
- AgentOS rank-5 faction selection is live with deterministic faction choices, one free switch, persisted faction choice, LocalAuthority support, mission bias hooks, and AgentOS progression UI.
- Deterministic limit-order and faction-pressure engine contracts exist, and the terminal now previews faction pressure windows plus limit triggers for bound AgentOS factions while supporting persisted LocalAuthority limit-order commands.
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
- Expo SDK 54 package graph alignment passes `npx expo install --check`; native Xcode 26/iOS 26 and Android API 35 proof remains pending on a provisioned QA host.
- GLCH is admitted into the Oracle medium-risk momentum archetype and beta-tuned mirror path with retention/swarm viability still green.
- Post-push regression monitor state is worktree-safe via `git rev-parse --git-path regression-state.json`.
- Local Axiom web QA covers `/missions` route invariants and resets browser session state before login/trading checks.
- 2026 Apple/Google/Expo submission requirements are cited, including Xcode 26 / iOS 26 SDK and Android API 35 target gates.
- Store-facing asset audit, Dev Lab provenance report, and the `zara-p1-005` generated 37-asset inventory/check workflow exist with resolution, ownership, icon/splash, capture-safety, and source-rights findings.
- Screenshot-safe visual state captures exist for home, terminal, market, missions, inventory, and profile.
- Zoro-approved screenshot shot list, preview story spine, and cyberdeck store-page mood exist for autonomous store-media iteration.
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
- Store media direction approved around the current six-shot portrait screenshot set and Reel preview story spine.
- App Store preview storyboard and capture plan.
- Zoro-approved screenshot and preview mood direction.
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
