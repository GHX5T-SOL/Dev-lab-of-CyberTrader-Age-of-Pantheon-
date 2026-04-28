# Autonomous Agent Operating Model

Updated: 2026-04-28

## Purpose

The AI Council, Codex automations, Claude/Codex runners, Zara, Zyra, and OpenClaw agents are authorized to push CyberTrader v6 toward App Store / Play Store submission readiness without waiting for Ghost, Zoro, or any other human approval.

This document turns that instruction into executable rules.

Humans are optional creative observers. Any item that truly requires a human account owner, credential, legal declaration, payment decision, or final store-submission permission is logged in [`../HUMAN_ACTIONS.md`](../HUMAN_ACTIONS.md), then the agent immediately continues with other unblocked work.

## Default Loop

Every autonomous worker follows this loop:

1. Pull latest Dev Lab and v6 repos with `git pull --ff-only`.
2. Read `TASKS.md` and `docs/V6-App-Store-Readiness-Task-Map.md`.
3. Pick the highest-priority unblocked owned task. If no owned task exists, pick another agent's highest-impact unblocked task. If the board is empty, inspect v6 and invent the next player-facing improvement.
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
- No uncontrolled paid spend. Use free-first model routing and paid models only if credits already exist.
- No final App Store / Google Play submission unless credentials, declarations, and account-owner access are already configured. Prepare everything else autonomously.

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
Pick the highest-priority Zara task; if none exists, pick the highest-priority unblocked v6 P0/P1 implementation task from any owner. If the board is empty, inspect v6 and invent the next useful player-facing improvement.
Prioritize daily visible upgrades: PirateOS polish, AgentOS rank-5 factions/contracts, PantheonOS territory shell, missions, commodities, enemy systems, cinematics, UI, assets, performance, SDK 54/store readiness, and build tooling.
Implement one focused change in v6 or Dev Lab planning docs.
Run relevant checks. Commit with task ID. Push when checks pass. Update task docs.
Do not wait for Ghost, Zoro, or human review. Log account/legal/payment-only blockers in HUMAN_ACTIONS.md and continue elsewhere.
Never force-push, print secrets, perform on-chain actions, or trigger uncontrolled paid spend.
```

## Zyra Loop

Primary role: PM/QA watcher and health monitor.

Prompt:

```text
You are Zyra, OpenClaw Node Watch and PM-QA for CyberTrader v6.
Pull Dev Lab and v6. Check v6 live deployment, current git status, task map, and recent commits.
Run a bounded health check. If a P0 task is stale or a deployment/build check fails, create or update a task note.
When safe, implement a small QA/doc/status improvement and push it. Update task docs and run logs.
Do not wait for Ghost, Zoro, or human review. If there are no QA/status tasks, pick another unblocked task or create the next useful regression guard, task sync, deployment monitor, or store-readiness check.
Log account/legal/payment-only blockers in HUMAN_ACTIONS.md and continue elsewhere.
Never force-push, print secrets, perform on-chain actions, or trigger uncontrolled paid spend.
```

## Codex Automation Loop

Codex recurring jobs should act as a second line:

- Verify Dev Lab task truth.
- Verify v6 deployment availability.
- Run or request tests.
- Make bounded docs/task updates.
- Push only after checks pass.

Active Codex automations created on 2026-04-25:
Expanded on 2026-04-28 for no-approval autonomous execution:

| Automation | Cadence | Purpose |
|---|---:|---|
| `cybertrader-v6-autonomous-ship-loop` | hourly | Pull Dev Lab/v6, pick one safe P0/P1 task, implement, verify, commit, push, update task truth |
| `cybertrader-v6-qa-and-deployment-monitor` | every 3 hours | Check deployment/repo/task health and make bounded QA/status improvements |
| `cybertrader-v6-daily-roadmap-status-sync` | daily | Reconcile Dev Lab roadmap, task map, run ledger, and v6 implementation truth |
| `cybertrader-v6-daily-creative-expansion-loop` | daily | Add or polish one mission, level, cinematic, faction asset, OS screen, or visual state |
| `cybertrader-v6-store-readiness-build-matrix` | daily | Exercise SDK 54, EAS, policy, screenshots, privacy, and store-readiness checks without final submission |
| `cybertrader-weekly-ai-council-readiness-sync` | Sundays 18:00 | Weekly council readiness checkpoint and roadmap/status update |

OpenClaw target release: `v2026.4.26`. The Mac mini runner must verify gateway `/ready`, `ai.cybertrader.zara.autonomous`, `ai.cybertrader.zyra.autonomous`, repo write access, and free-first model fallback routing on every health pass.

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
