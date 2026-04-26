# Roadmap - Dev Lab Control Plane and CyberTrader v6

Updated: 2026-04-26

## Reality Check

The Dev Lab 3D office phase is complete. The Dev Lab is now the command center where Ghost, Zoro, the AI Council, Zara, Zyra, and Codex automations coordinate the actual game work.

The active game is:

```text
https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v6
https://cyber-trader-age-of-pantheon-v6.vercel.app
```

v6 already has the core playable loop: intro/login, LocalAuthority trades, ledger, inventory, XP/rank, locations, travel, heat/raids, couriers, news, flash events, NPC missions, district states, streaks, daily challenges, bounty, and away report.

The `rune-p0-001` technical audit is complete as of 2026-04-26: install, typecheck, tests, and Expo web export are green locally, with Expo toolchain dependency advisories logged for planned remediation. The `rune-p0-002` route hardening pass is also complete: protected routes recover after hydration, menu back actions have safe fallbacks, and Android hardware back returns safely from menu/terminal screens. The `rune-p0-003` persistence reliability pass is in progress, with storage regression coverage now verifying native save/load, reset clearing, and corrupt JSON recovery. The `rune-p0-004` EAS profile pass is complete, `oracle-p0-001` now provides a deterministic 1000-seed economy replay harness, `oracle-p0-002` locks launch survival, Heat, raid, and reward bands with zero issues, `ghost-p0-001` documents release blockers, direct-push criteria, and Gate A/B/C sign-off rules, `ghost-p0-002` assigns the top App Store architecture risks to owners with required evidence and aligns EAS Node to Expo SDK 52, `kite-p0-001` has SupabaseAuthority behind a tested feature-flag boundary, `axiom-p0-002` delivers the store-submission regression checklist (first-session, trading, store metadata) cross-linked to the rune/oracle/kite release notes, `nyx-p0-001` tightens the live first-session loop with home/terminal guidance, manual market ticks, and starter-profit tests, `nyx-p0-002` codifies 10-minute starter, route-runner, and contraband pressure bands, `zoro-p0-001` approves the first 10-minute Gate A journey with follow-up polish assigned, `vex-p0-001` improves mobile HUD readability and one-hand trade controls, `vex-p0-002` adds exported-web responsive viewport captures and self-contained Playwright QA across web, small phone, large phone, and tablet, `vex-p1-003` adds App Store-safe loading/empty/offline/error states, `talon-p0-002` adds the autonomous safety preflight and full `ship:check` command, `zyra-p0-002` now has a repeatable live deployment shell-marker health command, `reel-p0-001` defines the App Store preview storyboard, capture routes, store-safety rules, staged data needs, and Zoro approval checklist, `cipher-p0-001` cites current Apple/Google/Expo submission requirements while binding the Xcode 26 / iOS 26 SDK and Android API 35 target gates into the Axiom checklist, and `palette-p0-001` audits current commodity, Eidolon, cinematic, legacy reference, Remotion, icon/splash, and capture-evidence assets for resolution, ownership notes, and screenshot safety. The next native gate is running the first simulator/emulator builds against the Axiom checklist with those store-toolchain proofs included.

The next milestone is **App Store / Play Store submission readiness**, not more Dev Lab office work.

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
- Ghost release blockers, direct-push automation criteria, and Gate A/B/C sign-off rules are documented.
- Ghost architecture risk audit assigns the top 10 App Store submission risks to owners with evidence requirements.
- SupabaseAuthority remains off by default and is guarded by explicit flag/config tests before live validation.
- First-session loop guidance is live on home/terminal, with manual market ticks and a tested starter profitable sell path.
- Deterministic 10-minute pressure audit exists for starter, medium-risk, and contraband strategies.
- Mobile HUD readability and one-hand first-trade controls meet the first Vex P0 pass.
- Exported-web responsive viewport QA and capture evidence exist for web desktop, small phone, large phone, and tablet portrait.
- App Store-safe loading, empty, offline, and error states exist across route recovery, login validation, terminal locks, empty content, Settings local-mode disclosure, and safe system messages.
- Autonomous safety preflight and `ship:check` command exist before more direct-push implementation loops.
- `npm run health:live` verifies the live Vercel shell returns HTTP 200 and contains the expected Expo web entry markers.
- 2026 Apple/Google/Expo submission requirements are cited, including Xcode 26 / iOS 26 SDK and Android API 35 target gates.
- Palette asset audit documents resolution-safe current images, missing source-provenance proofs, missing icon/splash source art, and store-capture safety rules.
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
- Crash/log capture path.
- Native persistence hydration/recovery.
- SupabaseAuthority live project, migrations, RLS validation, and launch-scope decision.
- Store-safe privacy/token/trading language.

Primary owners: Ghost, Rune, Kite, Axiom, Cipher, Talon.

## Phase 3 - App Store Candidate (2026-05-25 -> 2026-06-14)

Status: **Upcoming**

Goal: reach a submission-quality candidate.

Required:

- App Store screenshots.
- App Store preview storyboard and capture plan.
- Source-cleared asset provenance, icon, splash, and approved screenshot-safe visual states.
- App preview video.
- Store description, keywords, support URL, privacy policy copy, age rating notes.
- Legal/security review of $OBOL naming, simulated trading, wallet flags, and data handling.
- Final economy tuning.
- Regression suite green.
- AI Council store-readiness sign-off.

Primary owners: Zoro, Reel, Palette, Cipher, Kite, Oracle, Compass.

## Phase 4 - Closed Beta (2026-06-15 -> 2026-07-12)

Status: **Upcoming**

Goal: run a small controlled beta and tune from real play.

Required:

- 20-100 invited players.
- Crash-free sessions above 99%.
- D1 retention baseline.
- Feedback intake loop.
- Economy stress reports from Hydra/ElizaOS and real beta data.
- Store listing refinements.

Primary owners: Axiom, Compass, Hydra, Oracle, Ghost, Zoro.

## Phase 5 - Public Launch (target 2026-08)

Status: **Upcoming**

Goal: public launch after store approval and beta hardening.

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

Autonomous agents may push directly when checks pass and the change is reversible. No force-push, no secrets, no on-chain actions, no production data deletion.

## Escalation Triggers

- Store policy/legal uncertainty -> Cipher/Kite/Ghost.
- Build fails twice consecutively -> Axiom/Rune/Ghost.
- Economy tuning causes soft-locks or impossible starts -> Oracle/Nyx/Ghost.
- Autonomous agent pushes a breaking change -> Talon triggers rollback protocol.

## Living Doc Rule

This roadmap changes whenever the product truth changes. Update the matching web data file at `web/src/data/roadmap.ts` in the same commit.
