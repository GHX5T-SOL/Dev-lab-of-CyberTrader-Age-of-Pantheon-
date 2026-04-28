# Codex OpenClaw Watchdog Hardening - 2026-04-28T21:51:39Z

Automation: CyberTrader v6 QA and deployment monitor
Task: `zyra-p0-002`
Owner: Zyra / Codex

## Result

Completed the missing OpenClaw watchdog wiring that the runner installer already references. The runner now prefers the `2026.4.26` runtime path, records last start/finish markers, bounds stale runner locks with `RUN_LOCK_MAX_AGE_SECONDS`, checks `/ready` before backend execution, records sync blockers instead of leaving half-rebased repos, and avoids pushing if the final rebase fails.

## Changes

- Added `scripts/openclaw/cybertrader-openclaw-watchdog.sh` for 15-minute launchd health checks, stale lock cleanup, OpenClaw version drift recovery, gateway restart, Zara/Zyra kickstart, and JSON status output.
- Hardened `scripts/openclaw/cybertrader-agent-runner.sh` against stale live locks, incomplete rebase states, gateway downtime, and final sync conflicts.
- Updated `scripts/openclaw/install-cybertrader-runners.sh` so installs copy and bootstrap the watchdog launchd job alongside Zara/Zyra.
- Updated `docs/OpenClaw-Autonomous-Runners.md` with the launchd watchdog job and current stability policy.

## Validation

- `bash -n scripts/openclaw/cybertrader-agent-runner.sh` passed.
- `bash -n scripts/openclaw/cybertrader-openclaw-watchdog.sh` passed.
- Dev Lab type/build checks are recorded in the parent monitor run after this patch.

## Follow-up Verification

- Installed on `brucewayne@100.117.148.52` after this patch.
- OpenClaw reports `2026.4.26`, gateway `/ready` returns healthy, and launchd lists Zara, Zyra, and `ai.cybertrader.openclaw-watchdog`.
- The watchdog was corrected after first install so it does not restart active agents every 15 minutes; it only starts missing or idle/exited jobs.
- Zara pulled Dev Lab and v6 to current and began active v6 implementation work. Zyra correctly waits behind the global runner lock when Zara owns the active cycle.
- OpenAI generation can still be quota-limited; runners keep using free routing and deterministic maintenance fallbacks when provider calls fail.
