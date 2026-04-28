# Cloud Automation Suite — CyberTrader: Age of Pantheon

Date: 2026-04-29
Status: **Active**

This is the cron-driven cloud routine roster that keeps CyberTrader v6
shipping autonomously even when the founders' laptop is asleep. It runs
alongside the OpenClaw Mac mini operators (Zara, Zyra) and the existing
Codex/Claude/Codex-runner agents.

Each routine is self-contained: it pulls latest, reads truth, executes,
validates, commits, syncs Dev-lab, pushes, and emits a run note. Routines
do not share state across runs; they re-derive what they need from git
and the living docs.

## Roster

| Routine | Schedule (local) | Cron | Purpose |
| --- | --- | --- | --- |
| `cybertrader-ship-loop` | every 4 h | `0 */4 * * *` | Main builder. Picks the highest-impact unblocked task, ships in v6, syncs Dev-lab. |
| `cybertrader-visual-polish` | 4×/day at 01:30 / 07:30 / 13:30 / 19:30 | `30 1,7,13,19 * * *` | Visible-in-the-live-game polish. Vex/Palette/Reel hat. |
| `cybertrader-pr-sweeper` | 4×/day at 01:15 / 07:15 / 13:15 / 19:15 | `15 1,7,13,19 * * *` | Audits open PRs on both repos, merges/closes/cleans branches. |
| `cybertrader-morning-briefing` | daily at 08:00 | `0 8 * * *` | Compass briefing posted to Dev-lab; updates HEARTBEAT and Whiteboard. |
| `cybertrader-evening-council` | daily at 18:00 | `0 18 * * *` | 7-member AI Council retro + tomorrow's top-3 plan, logged in Decision-Log. |
| `cybertrader-content-expander` | 2×/day at 11:00 / 23:00 | `0 11,23 * * *` | Creative expansion — new commodity / mission / faction / cinematic / ability. |
| `cybertrader-store-prep` | daily at 10:45 | `45 10 * * *` | Gate C work — store metadata, privacy forms, screenshots, reviewer notes. |
| `cybertrader-readiness-audit` | weekly Mon 09:00 | `0 9 * * 1` | Full Gate-A/B/C audit, runs every harness, escalates new requirements. |

Each routine prompt is checked into the harness as a SKILL.md under
`~/.claude/scheduled-tasks/<routine-id>/SKILL.md` and is created/updated
through the `mcp__scheduled-tasks__*` tools. Each prompt requests Opus 4.7
max-mode extra-high thinking and demands AI Council consultation for any
non-trivial decision.

## Loop Contract (shared)

Every routine follows the contract from
[`docs/Autonomous-Build-Pipeline.md`](Autonomous-Build-Pipeline.md):

1. Pull latest Dev-lab and v6 main with `--ff-only`.
2. Read the canonical living docs (`TASKS.md`,
   `docs/V6-App-Store-Readiness-Task-Map.md`, `docs/Roadmap.md`,
   `HUMAN_ACTIONS.md`, `HEARTBEAT.md`, recent
   `docs/automation-runs/*`, latest v6 release notes).
3. Pick the highest-impact unblocked work that fits the routine's hat.
4. Convene an AI Council per
   [`AI_Council_Charter.md`](../AI_Council_Charter.md) for any non-trivial
   decision; log the outcome in `docs/Decision-Log.md`.
5. Implement a focused, scoped, reversible change in v6.
6. Run the full validation chain that fits the change:
   `npm run safety:autonomous`, `npm run typecheck`,
   `npm test -- --runInBand`, `npm run perf:budgets`,
   `npm run provenance:assets:check`, `npx expo export --platform web`,
   plus targeted runs (`qa:smoke`, `qa:responsive`, `qa:axiom:live`,
   `health:live`, `replay:economy`, `swarm:market`, `retention:beta`,
   `stress:economy`, `endurance:economy`, `archetypes:report`,
   `tuning:beta`, `capture:screenshots`).
7. Single-commit push to v6 main with a task-ID-prefixed message.
8. Sync the six Dev-lab living docs (`TASKS.md`,
   `web/src/data/tasks.ts`, `docs/V6-App-Store-Readiness-Task-Map.md`,
   `docs/Roadmap.md`, `web/src/data/roadmap.ts`,
   `web/src/data/status.ts`).
9. Emit a `docs/automation-runs/<UTC-timestamp>-<routine-id>.md` note.
10. Push Dev-lab.

## Hard Stops (non-negotiable)

- No force-push.
- No secret printing or committing.
- No on-chain or real-money actions.
- No final App Store / Play Store submission unless credentials and
  declarations are already configured (`HUMAN_ACTIONS.md`).
- No destructive deletion outside the change scope.
- No uncontrolled paid spend.
- No dependency upgrade without running the relevant build/test path.

When a hard stop fires, the routine writes the blocker into
`HUMAN_ACTIONS.md`, logs it in the run note, and immediately picks another
unblocked task instead of waiting.

## Daily Cadence at a Glance

```
00:00  ─── ship-loop run 1 ────────────────────────────────────────
01:15      pr-sweeper run 1
01:30      visual-polish run 1
04:00  ─── ship-loop run 2 ────────────────────────────────────────
07:15      pr-sweeper run 2
07:30      visual-polish run 2
08:00      morning-briefing  ◀ Whiteboard refresh, top-3 plan
08:00  ─── ship-loop run 3 ────────────────────────────────────────
10:45      store-prep         ◀ Gate C deliverable per day
11:00      content-expander   ◀ creative ship
12:00  ─── ship-loop run 4 ────────────────────────────────────────
13:15      pr-sweeper run 3
13:30      visual-polish run 3
16:00  ─── ship-loop run 5 ────────────────────────────────────────
18:00      evening-council    ◀ retro + tomorrow plan
19:15      pr-sweeper run 4
19:30      visual-polish run 4
20:00  ─── ship-loop run 6 ────────────────────────────────────────
23:00      content-expander   ◀ second creative ship of the day
Monday 09:00  readiness-audit ◀ weekly app-store readiness sweep
```

That schedule provides ~24 substantive autonomous touches per day plus
the weekly audit, while keeping the cron load conservative and ensuring
the Mac mini regression-monitor LaunchAgent (`talon-p1-004`) handles the
fast-tick health checks every 15 min separately.

## Operator Notes

- The OpenClaw Mac mini Zara and Zyra runners stay on their existing
  hourly + 15-min schedules. The cloud routines do **not** displace them;
  they add a parallel cadence so work continues even when the Mac mini is
  offline or rate-limited.
- Routines run as a fresh session each fire, so they read the same docs a
  human collaborator would. They do not assume any shared memory beyond
  what is committed to the repos.
- Each routine prompt names the explicit Council members it should
  rotate through; if a routine ships frequently, the Council membership
  variance keeps the team from rubber-stamping.
- Cron expressions are evaluated in the user's local timezone, not UTC.

## Review and Tuning

The `cybertrader-readiness-audit` weekly pass evaluates whether the suite
is producing the right shape of output. If a routine's run notes show
repeated regressions, the audit can recommend updating the relevant
SKILL.md prompt or pausing the cron via `mcp__scheduled-tasks__update_*`.

When a new long-running gate appears (e.g. iOS simulator validation,
Android emulator pass, EAS production build), the audit may schedule a
**one-off** task with `fireAt` instead of a recurring cron.
