# 2026-04-26 OpenClaw recovery

Status: recovered to a stable launchd-runner setup.

What changed:
- Zara and Zyra now run through external launchd jobs on `brucewayne@100.117.148.52`.
- Dev Lab remains the source of truth for lore, roadmap, AI Council docs, and living task maps.
- CyberTrader v6 remains the implementation repo for product changes.
- Codex now uses API-key auth with `provider: openai` and `xhigh` reasoning instead of the stale ChatGPT/Aperture session.
- OpenClaw thinking defaults were changed from invalid `max` to `xhigh`.
- OpenClaw Docker sandbox mode was disabled because Docker is not installed on the Mac mini.
- The runner has a global lock, a Zyra startup delay, and stale-lock cleanup to prevent git collisions.
- Lock cleanup is guarded to the top-level runner process so timeout helper subprocesses cannot release the global lock while an agent is still working.
- Backend calls are capped at 45 minutes to prevent frozen shifts.

Provider status:
- OpenAI API key is present and can list models.
- OpenAI generation is currently quota-limited, so the runner falls through to Claude Code.
- ClawRouter/BlockRun was re-tested and disabled again because the gateway did not reach `/ready` when the proxy was enabled.

Active jobs:
- `ai.cybertrader.zara.autonomous`: implementation and production changes every 2 hours.
- `ai.cybertrader.zyra.autonomous`: QA, task sync, release readiness, and recovery every 1 hour.

Operational command:

```bash
ssh brucewayne@100.117.148.52
launchctl list | grep ai.cybertrader
tail -f ~/.openclaw/cybertrader-runners/logs/zara.log
tail -f ~/.openclaw/cybertrader-runners/logs/zyra.log
```
