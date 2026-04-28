# Fully Autonomous CyberTrader Build Pipeline

Updated: 2026-04-28

## Directive

CyberTrader v6 is now built by an autonomous AI team. Ghost and Zoro remain the human founders and creative reference points, but they are not approval gates for ordinary development.

The AI Council, Codex automations, Claude/Codex runners, Zara, and Zyra can choose tasks, design features, expand lore, implement code, test, commit, push, update Dev Lab, and repeat continuously.

## Loop Contract

Every autonomous loop must:

1. Pull latest Dev Lab and v6.
2. Read Dev Lab task truth, roadmap, game bible, and current v6 state.
3. Pick the highest-impact unblocked task.
4. Make a focused v6 improvement that should be visible to players whenever possible.
5. Run relevant checks.
6. Commit and push v6 changes.
7. Update Dev Lab tasks, roadmap/status, and an automation run note.
8. Repeat without waiting for human instruction.

## Creative Scope

Agents may expand beyond the original bible when it improves the game:

- new factions, rivals, districts, commodities, abilities, levels, raids, market disasters, and boss events;
- PirateOS polish, AgentOS rank-5 faction systems, and PantheonOS rank-20 territory systems;
- new UI states, animations, cinematics, trailers, store assets, sound/motion direction, and retention systems.

The lore bible is a strong guide, not a cage.

## Safety Rails

Allowed without human approval:

- direct pushes to `main` after checks pass;
- autonomous branch creation for larger migrations;
- autonomous squash/merge when checks are green;
- docs, roadmap, tasks, assets, gameplay, UI, test, and automation changes;
- free-first model routing and fallback maintenance runs.

Hard stops:

- no force-push;
- no secret printing or committing;
- no irreversible on-chain/mainnet actions;
- no uncontrolled paid spend;
- no final App Store or Google Play submission unless account credentials and required declarations are already configured.

If a hard-stop item appears, write it to [`HUMAN_ACTIONS.md`](../HUMAN_ACTIONS.md), log the blocker, and continue with other work.

## Daily Visible Upgrade Rule

At least one autonomous loop per day should try to produce a visible v6 improvement on the live deployment, not only documentation. Good targets include:

- clearer first-session flow;
- stronger PirateOS cyberdeck UI;
- AgentOS faction unlocks;
- PantheonOS territory map;
- new missions or NPC contracts;
- new commodities and market events;
- cinematic or transition polish;
- screenshot/store-media improvements;
- performance and loading polish.

## OpenClaw Roles

- **Zara** owns implementation, asset/provenance work, build tooling, visual upgrades, SDK/toolchain scouting, and store-media pipeline tasks.
- **Zyra** owns QA, deployment health, task ledger, roadmap sync, runner recovery, stale-job detection, and automation hygiene.

Both must push useful updates when checks pass. If model routing fails, they must fall back to deterministic maintenance, record what happened, and keep the pipeline moving.
