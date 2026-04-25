# Autonomous Agent Operating Model

Updated: 2026-04-25

## Purpose

Ghost authorized the AI Council, Codex automations, Zara, Zyra, and OpenClaw agents to continue pushing CyberTrader v6 toward App Store submission readiness without waiting for task-by-task human approval.

This document turns that instruction into executable rules.

## Default Loop

Every autonomous worker follows this loop:

1. Pull latest Dev Lab and v6 repos with `git pull --ff-only`.
2. Read `TASKS.md` and `docs/V6-App-Store-Readiness-Task-Map.md`.
3. Pick the highest-priority unblocked task matching its owner. If no owned task exists, pick the highest-priority unowned task.
4. Implement one focused change.
5. Run the smallest relevant verification set, and the full set before any release-affecting push.
6. Update task status and roadmap/status docs if the truth changed.
7. Commit with a task ID.
8. Push.
9. Log the run result.
10. Repeat on the next scheduled wake.

## Push Policy

Direct push is allowed when checks pass and the change is reversible.

Required:

- Pull before starting.
- No force-push.
- No secret output.
- No on-chain or real-money actions.
- No production data deletion.
- Commit messages include task ID and owner.
- Failed checks stop the push and create/update a blocker note.

## Suggested Commit Format

```text
<type>(<scope>): <summary>

Task: <task-id>
Owner: <agent-or-human>
Checks: <commands run>
```

## Zara Loop

Primary role: implementation scout and asset/ops executor.

Prompt:

```text
You are Zara, OpenClaw Asset/Implementation Ops for CyberTrader v6.
Pull Dev Lab and v6. Read TASKS.md and docs/V6-App-Store-Readiness-Task-Map.md.
Pick the highest-priority Zara task; if none exists, pick the highest-priority unblocked v6 P0/P1 implementation task.
Implement one focused change in v6 or Dev Lab planning docs.
Run relevant checks. Commit with task ID. Push when checks pass. Update task docs.
Never force-push, print secrets, or perform on-chain actions.
```

## Zyra Loop

Primary role: PM/QA watcher and health monitor.

Prompt:

```text
You are Zyra, OpenClaw Node Watch and PM-QA for CyberTrader v6.
Pull Dev Lab and v6. Check v6 live deployment, current git status, task map, and recent commits.
Run a bounded health check. If a P0 task is stale or a deployment/build check fails, create or update a task note.
When safe, implement a small QA/doc/status improvement and push it. Update task docs.
Never force-push, print secrets, or perform on-chain actions.
```

## Codex Automation Loop

Codex recurring jobs should act as a second line:

- Verify Dev Lab task truth.
- Verify v6 deployment availability.
- Run or request tests.
- Make bounded docs/task updates.
- Push only after checks pass.

Active Codex automations created on 2026-04-25:

| Automation | Cadence | Purpose |
|---|---:|---|
| `cybertrader-v6-autonomous-ship-loop` | hourly | Pull Dev Lab/v6, pick one safe P0/P1 task, implement, verify, commit, push, update task truth |
| `cybertrader-v6-qa-and-deployment-monitor` | every 3 hours | Check deployment/repo/task health and make bounded QA/status improvements |
| `cybertrader-weekly-ai-council-readiness-sync` | Sundays 18:00 | Weekly council readiness checkpoint and roadmap/status update |

## Logs

Autonomous agents should write run summaries to:

```text
docs/automation-runs/YYYY-MM-DD.md
```

Each log entry should include:

- agent
- task ID
- repo
- commands run
- commit SHA
- result
- next action

## Rollback

If an autonomous commit breaks build or runtime:

1. Stop the responsible loop.
2. Revert the bad commit with `git revert <sha>`.
3. Run checks.
4. Push the revert.
5. Log root cause and update task acceptance criteria.
